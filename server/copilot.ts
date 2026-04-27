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

        extraMessages.push({
          role: "system",
          content: `Dados das campanhas lidos do Google Sheets:\n${JSON.stringify(
            campaignData,
            null,
            2
          )}`,
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

    const completion = await client.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content:
            "Você é um copiloto de dados corporativos. Responda de forma clara, objetiva e útil, sempre em português do Brasil.",
        },
        ...extraMessages,
        ...messages,
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

    return res.status(500).json({ error: message });
  }
});

export default router;