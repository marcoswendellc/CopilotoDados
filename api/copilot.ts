import OpenAI from "openai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: "Messages não enviadas" });
    }

    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "system",
          content:
            "Você é um copiloto de dados. Responda de forma clara, objetiva e em português.",
        },
        ...messages,
      ],
    });

    const answer =
      completion.choices?.[0]?.message?.content || "Sem resposta";

    return res.status(200).json({ answer });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      error: error.message || "Erro interno",
    });
  }
}