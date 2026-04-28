import { getCampaignData } from "../server/googleSheets";
import { buildSheetContext } from "./copilotHelpers";

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
            content: `Você é um copiloto de dados da Terral Shopping Centers, especializado em análise de campanhas promocionais. Responda de forma clara, objetiva e útil, sempre em português do Brasil. Utilizar somente os dados fornecidos abaixo e não inventar informações.`,
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

    const data = await response.json();
    console.log("OpenRouter status:", response.status);
    console.log("OpenRouter data:", JSON.stringify(data));

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Erro ao consultar OpenRouter",
        details: data,
      });
    }

    const answer =
      data?.choices?.[0]?.message?.content?.trim() || "Não consegui gerar resposta.";

    return res.status(200).json({ answer });
  } catch (error: any) {
    console.error("Erro interno API:", error);
    return res.status(500).json({
      error: error?.message || "Erro interno",
    });
  }
}
