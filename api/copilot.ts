import { getCampaignData } from "../server/googleSheets.js";
import { buildSheetContext, buildSystemPrompt, validateQueryAction, OpenRouterResponse } from "../server/copilotService";

function normalizeContent(content: unknown) {
  if (typeof content === "string") {
    return content.trim();
  }
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "text" in item) {
          return String((item as any).text);
        }
        return JSON.stringify(item);
      })
      .join("")
      .trim();
  }
  if (content && typeof content === "object") {
    if ("text" in content && typeof (content as any).text === "string") {
      return ((content as any).text as string).trim();
    }
    return JSON.stringify(content);
  }
  return "";
}

function extractJsonObject(text: string) {
  const firstBrace = text.indexOf("{");
  if (firstBrace === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = firstBrace; i < text.length; i++) {
    const char = text[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (char === "\\") {
        escape = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(firstBrace, i + 1);
      }
    }
  }

  return null;
}

function parseAssistantAction(content: unknown) {
  if (!content) {
    return null;
  }
  if (typeof content === "object") {
    return content;
  }
  if (typeof content !== "string") {
    return null;
  }

  const snippet = extractJsonObject(content);
  if (!snippet) {
    return null;
  }

  try {
    return JSON.parse(snippet);
  } catch {
    return null;
  }
}

function rowMatchesFilters(row: Record<string, unknown>, filters: Record<string, unknown>) {
  return Object.entries(filters).every(([field, expected]) => {
    const value = row[field];

    if (value == null && expected == null) {
      return true;
    }
    if (value == null || expected == null) {
      return false;
    }

    if (typeof expected === "string") {
      return String(value).toLowerCase() === expected.toLowerCase();
    }

    if (typeof expected === "number") {
      return typeof value === "number" ? value === expected : Number(value) === expected;
    }

    return String(value) === String(expected);
  });
}

function pickFields(row: Record<string, unknown>, fields: string[]) {
  if (!fields || fields.length === 0) {
    return row;
  }

  return fields.reduce((acc, field) => {
    if (field in row) {
      acc[field] = row[field];
    }
    return acc;
  }, {} as Record<string, unknown>);
}

function sortRows(rows: Record<string, unknown>[], ordering: string) {
  const field = ordering?.trim();
  if (!field) {
    return rows;
  }

  return [...rows].sort((a, b) => {
    const left = a[field];
    const right = b[field];

    if (left == null) return 1;
    if (right == null) return -1;

    if (typeof left === "number" && typeof right === "number") {
      return left - right;
    }

    return String(left).localeCompare(String(right), "pt-BR", { numeric: true });
  });
}

function formatQueryResult(rows: Record<string, unknown>[]) {
  const previewRows = rows.slice(0, 50);
  return JSON.stringify({ total: rows.length, rows: previewRows }, null, 2);
}

async function executeDataQuery(action: any, campaignData: Array<Record<string, unknown>>) {
  const dados = action?.dados ?? action;
  const tableName = String(dados?.tabela ?? "").trim();
  if (!tableName) {
    throw new Error("A consulta não informou uma tabela.");
  }

  const supportedTable = /dados[_ ]?copiloto/i.test(tableName);
  if (!supportedTable) {
    throw new Error(`Tabela não suportada: ${tableName}`);
  }

  const filters = typeof dados?.filtros === "object" && dados.filtros ? dados.filtros : {};
  const fields = Array.isArray(dados?.campos) ? dados.campos.map(String) : [];
  const ordering = String(dados?.ordenacao ?? "").trim();
  const limit = Number.isFinite(Number(dados?.limite)) ? Math.max(1, Number(dados?.limite)) : 100;

  const filteredRows = campaignData.filter((row) => rowMatchesFilters(row, filters));
  const sortedRows = sortRows(filteredRows, ordering);
  const limitedRows = sortedRows.slice(0, limit);

  return limitedRows.map((row) => pickFields(row, fields));
}

function formatValue(value: unknown) {
  if (value == null) {
    return "";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

function buildQuerySummary(action: any, rows: Record<string, unknown>[]) {
  if (!rows || rows.length === 0) {
    return "Nenhum registro foi encontrado para a consulta solicitada.";
  }

  const dados = action?.dados ?? action;
  const fields: string[] = Array.isArray(dados?.campos) && dados.campos.length > 0
    ? dados.campos.map((item: unknown) => String(item))
    : Object.keys(rows[0]);

  const previewRows = rows.slice(0, 20);
  const lines = previewRows.map((row) =>
    fields
      .map((field: string) => `${field}: ${formatValue(row[field])}`)
      .join(" | ")
  );

  return `Foram encontrados ${rows.length} registros. Exibindo até ${previewRows.length} registros:\n${lines.join("\n")}`;
}

async function rebuildAnswerWithQueryResults(
  originalMessages: Array<{ role: string; content: string }>,
  action: any,
  queryResult: Array<Record<string, unknown>>
) {
  const lastUserMessage = [...originalMessages].reverse().find((message) => message.role === "user");
  const originalQuestion = lastUserMessage?.content || "";

  const followUpResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.OPENROUTER_SITE_URL || "https://copilotodados.vercel.app",
      "X-Title": process.env.OPENROUTER_APP_NAME || "Copiloto de Dados",
    },
    body: JSON.stringify({
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content:
            "Você é um copiloto de dados. Agora o sistema já executou a consulta solicitada e obteve resultados de dados. Responda de forma clara e objetiva, em português do Brasil, usando apenas as informações retornadas pela consulta e a pergunta original do usuário.",
        },
        {
          role: "user",
          content: `Pergunta original: ${originalQuestion}\n\nConsulta executada: ${JSON.stringify(action, null, 2)}\n\nResultados da consulta: ${formatQueryResult(queryResult)}\n\nCom base nisso, responda a pergunta do usuário de forma direta e útil.`,
        },
      ],
      temperature: 0.3,
    }),
  });

  const followUpData = (await followUpResponse.json()) as OpenRouterResponse;
  if (!followUpResponse.ok) {
    return `O provedor não conseguiu gerar a resposta final automaticamente. Aqui está o resultado da consulta diretamente:\n${buildQuerySummary(action, queryResult)}`;
  }

  return normalizeContent(followUpData?.choices?.[0]?.message?.content) ||
    `O provedor retornou uma resposta vazia, mas já consultei os dados e aqui está o resultado diretamente:\n${buildQuerySummary(action, queryResult)}`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const hasKey = !!process.env.OPENROUTER_API_KEY;
    console.log("OPENROUTER_API_KEY exists?", hasKey);

    if (!hasKey) {
      return res.status(500).json({
        error: "OPENROUTER_API_KEY não encontrada",
      });
    }

    const { messages, spreadsheetId, range } = req.body as {
      messages?: Array<{ role: "user" | "assistant" | "system"; content: string }>;
      spreadsheetId?: string;
      range?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Messages não enviadas",
      });
    }

    const sheetId = String(spreadsheetId ?? process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? "");
    const sheetRange = String(range ?? process.env.GOOGLE_SHEETS_RANGE ?? "Dados_copiloto!A1:P20000");

    const campaignData = await getCampaignData({
      spreadsheetId: sheetId || undefined,
      range: sheetRange || undefined,
    });

    const sheetContext = buildSheetContext(campaignData);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.OPENROUTER_SITE_URL || "https://copilotodados.vercel.app",
        "X-Title": process.env.OPENROUTER_APP_NAME || "Copiloto de Dados",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          {
            role: "system",
            content: buildSystemPrompt(),
          },
          {
            role: "system",
            content: sheetContext,
          },
          ...messages,
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json() as OpenRouterResponse;
    console.log("OpenRouter status:", response.status);
    console.log("OpenRouter data:", JSON.stringify(data));

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Erro ao consultar OpenRouter",
        details: data,
      });
    }

    const rawAssistantContent = data?.choices?.[0]?.message?.content;
    const assistantAction = parseAssistantAction(rawAssistantContent);
    let validatedAction = null;

    try {
      validatedAction = assistantAction ? validateQueryAction(assistantAction) : null;
    } catch (validationError: unknown) {
      console.error("Ação de consulta inválida:", validationError);
    }

    if (validatedAction?.acao === "consultar_api") {
      try {
        const queryResult = await executeDataQuery(validatedAction, campaignData);
        const answer = await rebuildAnswerWithQueryResults(messages, validatedAction, queryResult);
        return res.status(200).json({ answer });
      } catch (actionError: any) {
        console.error("Erro ao executar consulta de dados:", actionError);
        const fallback = normalizeContent(rawAssistantContent) || "Não consegui gerar resposta.";
        return res.status(200).json({
          answer: `A ação de consulta foi detectada, mas não pôde ser executada: ${actionError?.message || "erro desconhecido"}.\n\n${fallback}`,
        });
      }
    }

    const answer = normalizeContent(rawAssistantContent) || "Não consegui gerar resposta.";
    return res.status(200).json({ answer });
  } catch (error: any) {
    console.error("Erro interno API:", error);
    return res.status(500).json({
      error: error?.message || "Erro interno",
    });
  }
}
