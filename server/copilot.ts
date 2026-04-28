import { Router, Request, Response } from "express";
import OpenAI from "openai";
import { getCampaignData } from "./googleSheets";

const router = Router();

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY não foi encontrada no arquivo .env");
}

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:8080",
    "X-OpenRouter-Title": process.env.OPENROUTER_APP_NAME || "Copiloto de Dados",
  },
});

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

router.post("/copilot", async (req: Request, res: Response) => {
  try {
    const { messages } = req.body as { messages?: ChatMessage[] };
    const spreadsheetId = String(req.body.spreadsheetId ?? "");
    const range = String(req.body.range ?? "");

    console.log("/api/copilot request", {
      messageCount: Array.isArray(messages) ? messages.length : 0,
      spreadsheetId: spreadsheetId || process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: range || process.env.GOOGLE_SHEETS_RANGE,
    });

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Histórico da conversa não informado.",
      });
    }

    const extraMessages: ChatMessage[] = [];
    const shouldFetchSheetData = Boolean(
      spreadsheetId ||
        range ||
        process.env.GOOGLE_SHEETS_SPREADSHEET_ID
    );

    if (shouldFetchSheetData) {
      try {
        const campaignData = await getCampaignData({
          spreadsheetId: spreadsheetId || undefined,
          range: range || undefined,
        });

        const sheetContext = truncateText(buildSheetContext(campaignData), 2400);
        console.log("Dados do Google Sheets prontos", {
          rowCount: campaignData.length,
          contextLength: sheetContext.length,
          preview: sheetContext.slice(0, 400),
        });

        extraMessages.push({
          role: "system",
          content: sheetContext,
        });
      } catch (error: unknown) {
        console.error("Erro ao carregar dados do Google Sheets:", error);
        return res.status(500).json({
          error:
            error instanceof Error
              ? error.message
              : "Erro interno ao ler dados do Google Sheets.",
        });
      }
    }

    const recentMessages = trimConversation(messages, 8);
    console.log("Usando histórico do chat", {
      originalMessages: messages.length,
      usedMessages: recentMessages.length,
    });

    const completion = await client.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content:
            "Você é um copiloto de dados.\n\n" +
            "REGRAS:\n\n" +
            "1. Você conhece o seguinte schema de dados:\n" +
            "Tabela: Dados_copiloto\n" +
            "Campos:\n" +
            "- cd_compra (int)\n" +
            "- sk_cliente (int)\n" +
            "- sk_loja (int)\n" +
            "- nm_fantasa (string)\n" +
            "- nm_segmento (string)\n" +
            "- dt_registro_mos (string)\n" +
            "- vl_compra (decimal)\n" +
            "- cd_empreendimento (int)\n" +
            "- nm_empreendimento (string)\n" +
            "- cd_promocao (int)\n" +
            "- nm_promocao (string)\n" +
            "- sk_dtinicio (string)\n" +
            "- sk_dtfim (string)\n" +
            "- tx_cep (int)\n" +
            "- uf (string)\n" +
            "- bairro (string)\n\n" +
            "2. Quando a pergunta do usuário puder ser respondida sem consultar dados, responda diretamente.\n\n" +
            "3. Quando precisar de dados:\n" +
            "- NÃO invente dados\n" +
            "- Gere uma consulta estruturada no formato JSON\n" +
            "- Solicite apenas os campos necessários\n" +
            "- Aplique filtros conforme a pergunta\n\n" +
            "Formato da resposta quando precisar de dados:\n\n" +
            "{\n" +
            "  \"acao\": \"consultar_api\",\n" +
            "  \"dados\": {\n" +
            "    \"tabela\": \"clientes\",\n" +
            "    \"campos\": [],\n" +
            "    \"filtros\": {},\n" +
            "    \"ordenacao\": \"\",\n" +
            "    \"limite\": 100\n" +
            "  }\n" +
            "}\n\n" +
            "4. Após receber os dados, gere uma resposta clara e objetiva com insights.\n\n" +
            "5. Nunca gere comandos destrutivos (DELETE, UPDATE, etc).\n\n" +
            "Responda sempre em português do Brasil.",
        },
        ...extraMessages,
        ...recentMessages,
      ],
      temperature: 0.3,
    });

    const answer =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Não consegui gerar resposta.";

    return res.json({ answer });
  } catch (error: unknown) {
    console.error("Erro OpenRouter:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Erro interno ao consultar a OpenRouter.";

    const details =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack?.split("\n").slice(0, 8),
          }
        : { error };

    return res.status(500).json({
      error: message,
      details,
    });
  }
});

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength - 3)}...`;
}

function formatSheetValue(value: unknown) {
  const text = value == null ? "" : String(value).replace(/\s+/g, " ").trim();
  return text.length > 60 ? `${text.slice(0, 60)}...` : text;
}

function getNumericValues(values: unknown[]) {
  return values.filter((value): value is number => typeof value === "number");
}

function getSampleValues(values: unknown[]) {
  const unique = Array.from(new Set(values.map((value) => String(value).trim()).filter(Boolean)));
  return unique.slice(0, 2);
}

function trimConversation(messages: ChatMessage[], maxMessages: number) {
  if (messages.length <= maxMessages) {
    return messages;
  }
  return messages.slice(-maxMessages);
}

function buildSheetContext(campaignData: Array<Record<string, unknown>>) {
  const totalRows = campaignData.length;
  const allColumns = totalRows > 0 ? Object.keys(campaignData[0]) : [];
  const columns = allColumns.slice(0, 6);
  const summaryRows = campaignData.slice(0, 10);
  const sampleRows = campaignData.slice(0, 2);

  const columnSummaries = columns.map((column) => {
    const values = summaryRows.map((row) => row[column]).filter((value) => value != null);
    const numericValues = getNumericValues(values);

    if (numericValues.length >= 3) {
      const sum = numericValues.reduce((acc, value) => acc + value, 0);
      const avg = sum / numericValues.length;
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      return `- ${column}: numeric, linhas válidas ${numericValues.length}, soma=${sum}, média=${avg.toFixed(2)}, min=${min}, max=${max}`;
    }

    const sampleValues = getSampleValues(values);
    return `- ${column}: text, linhas válidas ${values.length}, exemplos: ${sampleValues.join(", ")}`;
  });

  const sampleText = sampleRows
    .map((row, index) => {
      const values = columns
        .map((column) => `${column}: ${formatSheetValue(row[column])}`)
        .join(" | ");
      return `Linha ${index + 1}: ${values}`;
    })
    .join("\n");

  const truncatedNotice =
    totalRows > sampleRows.length
      ? `\n... exibindo somente os primeiros ${sampleRows.length} registros de ${totalRows} totais.`
      : "";

  return `Dados das campanhas lidos do Google Sheets:\n- Total de linhas: ${totalRows}\n- Colunas (mostrando até ${columns.length} primeiras): ${columns.join(", ")}\n- Sumário baseado em até ${summaryRows.length} linhas iniciais:\n${columnSummaries.join("\n")}\n- Exemplos das primeiras ${sampleRows.length} linhas:\n${sampleText}${truncatedNotice}\nUse apenas esses dados para responder e não invente informações.`;
}

export default router;