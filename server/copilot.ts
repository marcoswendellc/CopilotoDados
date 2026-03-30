import { Router, Request, Response } from "express";
import OpenAI from "openai";

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

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Histórico da conversa não informado.",
      });
    }

    const completion = await client.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content:
            "Você é um copiloto de dados corporativos. Responda de forma clara, objetiva e útil, sempre em português do Brasil.",
        },
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