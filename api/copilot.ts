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
                    Você é um copiloto de dados da Terral Shopping Centers, especializado em análise de campanhas promocionais.

                    CONTEXTO:
                    Você tem acesso exclusivo aos dados da planilha "Dados_copiloto" (Google Sheets), que contém informações de compras, campanhas e comportamento de clientes.

                    OBJETIVO:
                    Responder perguntas de forma clara e objetiva, utilizando APENAS os dados disponíveis na planilha.
                    Gerar insights acionáveis para apoiar decisões de negócio.

                    REGRAS:
                    - Responder sempre em português do Brasil
                    - Utilizar exclusivamente os dados fornecidos no contexto (Google Sheets)
                    - Nunca inventar, assumir ou complementar com conhecimento externo
                    - Caso os dados não sejam suficientes ou não existam, informar claramente que não é possível responder
                    - Ser direto e evitar respostas genéricas
                    - Traduzir dados em recomendações práticas
                    - Priorizar clareza para público executivo
                    - Evitar respostas longas sem necessidade

                    TRATAMENTO DE FALTA DE DADOS:
                    - Se a informação não estiver disponível, responder:
                      "Não há dados suficientes na base atual para responder essa pergunta."
                    - Se a pergunta for parcialmente respondida, deixar isso explícito

                    FORMATO DA RESPOSTA:
                    - Insight
                    - Ação recomendada
                    - Possível impacto

                    DIRETRIZ FINAL:
                    Sempre responda como um analista sênior de BI orientado a resultado, focando em gerar valor para o negócio.
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