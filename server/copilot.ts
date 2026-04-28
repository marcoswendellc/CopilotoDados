import { Router, Request, Response } from "express";
import OpenAI from "openai";
import { getCampaignData } from "./googleSheets";
import {
  buildSheetContext,
  buildSystemPrompt,
  executeDataQuery,
  normalizeContent,
  parseAssistantAction,
  rebuildAnswerWithQueryResults,
  validateQueryAction,
} from "./copilotService";

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
    let campaignData: Array<Record<string, unknown>> = [];
    const shouldFetchSheetData = Boolean(
      spreadsheetId ||
        range ||
        process.env.GOOGLE_SHEETS_SPREADSHEET_ID
    );

    if (shouldFetchSheetData) {
      try {
        campaignData = await getCampaignData({
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
          content: buildSystemPrompt(),
        },
        ...extraMessages,
        ...recentMessages,
      ],
      temperature: 0.3,
    });

    const rawAssistantContent = completion.choices?.[0]?.message?.content;
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
        return res.json({ answer });
      } catch (actionError: any) {
        console.error("Erro ao executar consulta de dados:", actionError);
        const fallback = normalizeContent(rawAssistantContent) || "Não consegui gerar resposta.";
        return res.json({
          answer: `A ação de consulta foi detectada, mas não pôde ser executada: ${actionError?.message || "erro desconhecido"}.\n\n${fallback}`,
        });
      }
    }

    const answer = normalizeContent(rawAssistantContent) || "Não consegui gerar resposta.";

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

function trimConversation(messages: ChatMessage[], maxMessages: number) {
  if (messages.length <= maxMessages) {
    return messages;
  }
  return messages.slice(-maxMessages);
}

export default router;