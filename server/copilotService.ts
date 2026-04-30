import { campaignSchema, getFieldNames, getFieldType, supportedTableNames } from "./dataSchema.js";

type FieldFilterValue =
  | string
  | number
  | boolean
  | null
  | {
      op: "eq" | "ne" | "contains" | "startsWith" | "endsWith" | "gt" | "lt" | "gte" | "lte";
      value: unknown;
    };

export type QueryAction = {
  acao: "consultar_api";
  dados: {
    tabela: string;
    campos: string[];
    filtros: Record<string, FieldFilterValue>;
    ordenacao: string;
    limite: number;
  };
};

export type OpenRouterResponse = {
  choices?: {
    message?: {
      content?: unknown;
    };
  }[];
};

export function normalizeContent(content: unknown) {
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

export function parseAssistantAction(content: unknown) {
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

export function buildSystemPrompt() {
  return `Você é um Especialista em Dados da Terral Shopping Centers, com forte experiência em análise de campanhas, comportamento do consumidor e programas de fidelidade.

  Seu papel é gerar insights de negócio claros, estratégicos e acionáveis — não apenas responder perguntas.

  ━━━━━━━━━━━━━━━━━━━
  📊 CONTEXTO DOS DADOS
  ━━━━━━━━━━━━━━━━━━━
  - Cada linha representa uma compra registrada
  - Os dados incluem cliente, loja, campanha, valor, data e localização
  - Os dados refletem campanhas promocionais e programas de fidelidade

  Campos importantes:
  - cd_compra → quantidade de compras
  - sk_cliente → clientes únicos
  - sk_loja → lojas únicas
  - vl_compra → valor da compra
  - nm_promocao → nome da campanha (usar sempre para análise)
  - nm_fantasa → nome da loja (usar sempre para análise)
  - nm_segmento → segmento da loja
  - uf / bairro / tx_cep → dados geográficos

  ━━━━━━━━━━━━━━━━━━━
  🧠 REGRAS DE ANÁLISE (OBRIGATÓRIO)
  ━━━━━━━━━━━━━━━━━━━
  Sempre que analisar dados:

  1. Calcule mentalmente:
  - total de compras
  - clientes únicos
  - lojas únicas
  - faturamento (soma de vl_compra)
  - ticket médio

  2. Analise, sempre que possível, nas dimensões:
  - campanha (nm_promocao)
  - loja (nm_fantasa)
  - segmento (nm_segmento)
  - estado (uf)
  - bairro

  3. Nunca apenas descreva dados.

  4. Sempre gere:
  - pelo menos 2 insights de negócio
  - pelo menos 1 oportunidade clara
  - pelo menos 1 sugestão prática de ação

  5. Sempre identifique:
  - padrões (concentração, crescimento, queda)
  - anomalias (valores fora do padrão)
  - oportunidades (regiões, segmentos ou campanhas pouco explorados)

  ━━━━━━━━━━━━━━━━━━━
  🎯 INTELIGÊNCIA DE NEGÓCIO
  ━━━━━━━━━━━━━━━━━━━
  Pense como um analista de marketing e BI:

  - Alto volume + baixo ticket → campanha de baixo valor percebido
  - Baixo volume + alto ticket → público qualificado/premium
  - Alta concentração geográfica → baixa capilaridade
  - Baixa presença regional → oportunidade de expansão
  - Poucos clientes com muitas compras → baixa distribuição
  - Muitas lojas com baixo desempenho → problema de engajamento

  ━━━━━━━━━━━━━━━━━━━
  📈 FOCO DAS ANÁLISES
  ━━━━━━━━━━━━━━━━━━━
  - Performance de campanhas
  - Ticket médio e faturamento
  - Comportamento de clientes
  - Comparação entre campanhas
  - Performance por loja e segmento
  - Distribuição geográfica
  - Padrões ao longo do tempo

  ━━━━━━━━━━━━━━━━━━━
  🗣️ COMO RESPONDER
  ━━━━━━━━━━━━━━━━━━━
  - Seja direto, claro e analítico
  - Vá além da pergunta sempre que possível
  - Destaque insights relevantes
  - Sugira ações práticas
  - Não invente dados

  ━━━━━━━━━━━━━━━━━━━
  🔎 CONSULTA DE DADOS
  ━━━━━━━━━━━━━━━━━━━
  Quando precisar consultar dados, retorne APENAS um JSON válido:

  {
    "acao": "consultar_api",
    "dados": {
      "tabela": "Dados_copiloto",
      "campos": ["campo1", "campo2"],
      "filtros": {},
      "ordenacao": "campo desc",
      "limite": 100
    }
  }

  ━━━━━━━━━━━━━━━━━━━
  ⚠️ REGRAS FINAIS
  ━━━━━━━━━━━━━━━━━━━
  - Se puder responder sem consulta, responda com análise + insights
  - Nunca invente dados
  - Nunca gere comandos destrutivos (DELETE, UPDATE, etc.)
  `;
}

function buildSchemaPrompt() {
  return [
    "Schema de dados disponíveis:",
    ...campaignSchema.fields.map((field) => `- ${field.name} (${field.type}): ${field.description}`),
  ].join("\n");
}

export function buildSheetContext(campaignData: Array<Record<string, unknown>>) {
  if (!campaignData || campaignData.length === 0) {
    return `A tabela ${campaignSchema.name} não contém registros ou não foi possível ler os dados.`;
  }

  const totalRows = campaignData.length;
  const columns = getFieldNames(campaignSchema).slice(0, 6);
  const summaryRows = campaignData.slice(0, 10);
  const sampleRows = campaignData.slice(0, 3);

  const columnSummaries = columns.map((column) => {
    const values = summaryRows.map((row) => row[column]).filter((value) => value != null);
    const numericValues = values.filter((value): value is number => typeof value === "number");

    if (numericValues.length >= 3) {
      const sum = numericValues.reduce((acc, value) => acc + value, 0);
      const avg = sum / numericValues.length;
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      return `- ${column}: numeric, linhas válidas ${numericValues.length}, soma=${sum}, média=${avg.toFixed(2)}, min=${min}, max=${max}`;
    }

    const sampleValues = Array.from(new Set(values.map((value) => String(value).trim()).filter(Boolean))).slice(0, 2);
    return `- ${column}: text, linhas válidas ${values.length}, exemplos: ${sampleValues.join(", ")}`;
  });

  const sampleText = sampleRows
    .map((row, index) =>
      `Linha ${index + 1}: ${columns
        .map((column) => `${column}: ${String(row[column] ?? "").replace(/\s+/g, " ").trim()}`)
        .join(" | ")}`
    )
    .join("\n");

  return `Dados da tabela ${campaignSchema.name} (${totalRows} registros):\n- Colunas (mostrando até ${columns.length}): ${columns.join(", ")}\n- Sumário baseado nas primeiras ${summaryRows.length} linhas:\n${columnSummaries.join("\n")}\n- Exemplos das primeiras ${sampleRows.length} linhas:\n${sampleText}`;
}

export function validateQueryAction(rawAction: unknown): QueryAction | null {
  if (!rawAction || typeof rawAction !== "object") {
    return null;
  }

  const action = rawAction as { acao?: unknown; dados?: unknown };
  if (action.acao !== "consultar_api") {
    return null;
  }

  const dados = (action.dados ?? action) as Record<string, unknown>;
  if (!dados || typeof dados !== "object") {
    throw new Error("A ação de consulta não contém o objeto 'dados'.");
  }

  const tabela = String(dados.tabela ?? "").trim();
  if (!tabela) {
    throw new Error("A consulta não informou uma tabela.");
  }
  if (!supportedTableNames.includes(tabela)) {
    throw new Error(`Tabela não suportada: ${tabela}`);
  }

  const fieldNames = getFieldNames(campaignSchema);
  const campos = Array.isArray(dados.campos)
    ? dados.campos.map((item) => String(item).trim()).filter(Boolean)
    : [];

  const invalidFields = campos.filter((field) => !fieldNames.includes(field));
  if (invalidFields.length > 0) {
    throw new Error(`Campos inválidos na consulta: ${invalidFields.join(", ")}`);
  }

  const filtros = dados.filtros && typeof dados.filtros === "object" ? dados.filtros as Record<string, FieldFilterValue> : {};
  const invalidFilterFields = Object.keys(filtros).filter((field) => !fieldNames.includes(field));
  if (invalidFilterFields.length > 0) {
    throw new Error(`Filtros inválidos na consulta: ${invalidFilterFields.join(", ")}`);
  }

  const ordenacao = String(dados.ordenacao ?? "").trim();
  if (ordenacao) {
    const [field] = ordenacao.split(/\s+/);
    if (!fieldNames.includes(field)) {
      throw new Error(`Ordenação inválida: ${ordenacao}`);
    }
  }

  const limite = Number.isFinite(Number(dados.limite)) ? Math.max(1, Number(dados.limite)) : 100;

  return {
    acao: "consultar_api",
    dados: {
      tabela,
      campos,
      filtros,
      ordenacao,
      limite,
    },
  };
}

function normalizeFilterValue(field: string, rawValue: unknown) {
  const fieldType = getFieldType(campaignSchema, field);
  if (typeof rawValue === "object" && rawValue !== null && "value" in rawValue) {
    const value = (rawValue as any).value;
    return normalizeFilterValue(field, value);
  }

  if (fieldType === "int" || fieldType === "decimal") {
    if (typeof rawValue === "number") {
      return rawValue;
    }
    if (typeof rawValue === "string") {
      const candidate = Number(rawValue.replace(/\./g, "").replace(/,/g, "."));
      return Number.isNaN(candidate) ? rawValue : candidate;
    }
  }

  if (fieldType === "date") {
    if (typeof rawValue === "string") {
      return rawValue;
    }
  }

  return rawValue;
}

function matchesCondition(value: unknown, condition: FieldFilterValue): boolean {
  if (condition === null) {
    return value == null;
  }

  if (typeof condition === "object" && condition !== null && "op" in condition && "value" in condition) {
    const op = (condition as any).op as string;
    const expected = normalizeContent((condition as any).value);
    const actual = normalizeContent(value);

    switch (op) {
      case "contains":
        return actual.toLowerCase().includes(String(expected).toLowerCase());
      case "startsWith":
        return actual.toLowerCase().startsWith(String(expected).toLowerCase());
      case "endsWith":
        return actual.toLowerCase().endsWith(String(expected).toLowerCase());
      case "gt":
        return Number(actual) > Number(expected);
      case "lt":
        return Number(actual) < Number(expected);
      case "gte":
        return Number(actual) >= Number(expected);
      case "lte":
        return Number(actual) <= Number(expected);
      case "ne":
        return actual !== expected;
      case "eq":
      default:
        return actual === expected;
    }
  }

  if (typeof value === "number" && typeof condition === "number") {
    return value === condition;
  }

  if (typeof value === "number" && typeof condition === "string") {
    return value === Number(condition);
  }

  if (typeof value === "string" && typeof condition === "number") {
    return Number(value) === condition;
  }

  return String(value).toLowerCase() === String(condition).toLowerCase();
}

function rowMatchesFilters(row: Record<string, unknown>, filters: Record<string, FieldFilterValue>) {
  return Object.entries(filters).every(([field, expected]) => {
    if (!(field in row)) {
      return false;
    }

    const rawValue = row[field];
    const normalizedExpected = normalizeFilterValue(field, expected);
    return matchesCondition(rawValue, normalizedExpected as FieldFilterValue);
  });
}

function sortRows(rows: Record<string, unknown>[], ordering: string) {
  if (!ordering) {
    return rows;
  }

  const [field, direction = "asc"] = ordering.split(/\s+/);
  if (!field || !getFieldNames(campaignSchema).includes(field)) {
    return rows;
  }

  const descending = direction.toLowerCase().startsWith("desc");

  return [...rows].sort((a, b) => {
    const left = a[field];
    const right = b[field];

    if (left == null) return 1;
    if (right == null) return -1;

    if (typeof left === "number" && typeof right === "number") {
      return descending ? right - left : left - right;
    }

    const cmp = String(left).localeCompare(String(right), "pt-BR", { numeric: true });
    return descending ? -cmp : cmp;
  });
}

export function executeDataQuery(action: QueryAction, campaignData: Array<Record<string, unknown>>) {
  const { dados } = action;
  const filters = dados.filtros ?? {};
  const fields = dados.campos.length > 0 ? dados.campos : getFieldNames(campaignSchema);
  const sortedRows = sortRows(campaignData.filter((row) => rowMatchesFilters(row, filters)), dados.ordenacao);
  const limitedRows = sortedRows.slice(0, Math.min(dados.limite, 1000));

  return limitedRows.map((row) =>
    fields.reduce((acc, field) => {
      if (field in row) {
        acc[field] = row[field];
      }
      return acc;
    }, {} as Record<string, unknown>)
  );
}

export function buildQuerySummary(action: QueryAction, rows: Record<string, unknown>[]) {
  if (!rows || rows.length === 0) {
    return "Não foram encontrados registros para essa consulta.";
  }

  const fields = action.dados.campos.length > 0 ? action.dados.campos : getFieldNames(campaignSchema);
  const previewRows = rows.slice(0, 10);
  const lines = previewRows.map((row) =>
    fields.map((field) => `${field}: ${formatValue(row[field])}`).join(" | ")
  );

  return `Encontrei ${rows.length} registros. Mostrando até ${previewRows.length} registros:\n${lines.join("\n")}`;
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

export async function rebuildAnswerWithQueryResults(
  originalMessages: Array<{ role: string; content: string }>,
  action: QueryAction,
  queryResult: Array<Record<string, unknown>>
) {
  const lastUserMessage = [...originalMessages].reverse().find((message) => message.role === "user");
  const originalQuestion = lastUserMessage?.content || "";

  const followUpResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "https://copilotodados.vercel.app",
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
          content: `Pergunta original: ${originalQuestion}\n\nConsulta executada: ${JSON.stringify(action, null, 2)}\n\nResultados da consulta: ${buildQuerySummary(action, queryResult)}\n\nCom base nisso, responda a pergunta do usuário de forma direta e útil.`,
        },
      ],
      temperature: 0.3,
    }),
  });

  const followUpData = await followUpResponse.json() as OpenRouterResponse;

  if (!followUpResponse.ok) {
    return `O provedor não conseguiu gerar a resposta final. Segue o resultado da consulta diretamente:\n${buildQuerySummary(action, queryResult)}`;
  }

  const assistantText = normalizeContent(followUpData?.choices?.[0]?.message?.content);
  if (!assistantText) {
    return `O provedor retornou uma resposta vazia. Segue o resultado da consulta diretamente:\n${buildQuerySummary(action, queryResult)}`;
  }

  return assistantText;
}
