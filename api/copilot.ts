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

    const { messages } = req.body as {
      messages?: Array<{ role: "user" | "assistant" | "system"; content: string }>;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Messages não enviadas",
      });
    }

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
                content: `
                    Você é um copiloto de dados especializado em BI e varejo.

                    CONTEXTO:
                    Atua com dados de campanhas, comportamento de clientes via Wi-Fi e performance de lojistas.

                    OBJETIVO:
                    Gerar insights acionáveis para tomada de decisão.

                    REGRAS:
                    - Responder em português do Brasil
                    - Ser direto e evitar respostas genéricas
                    - Sempre trazer recomendação prática
                    - Traduzir análise em impacto de negócio
                    - Priorizar clareza para público executivo
                    - Evitar respostas longas sem necessidade
                    - Quando faltar informação, fazer suposições razoáveis e sinalizar

                    FORMATO:
                    - Insight
                    - Ação recomendada
                    - Possível impacto

                    Antes de responder, pense como um analista sênior de BI focado em resultado.
                `,
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