import axios from "axios";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const generateResponse = async (
  messages: ChatMessage[]
): Promise<string> => {
  try {
    const response = await axios.post("/api/copilot", {
      messages,
    });

    return response.data?.answer || "Não consegui gerar resposta.";
  } catch (error: unknown) {
    const err = error as {
      response?: {
        status?: number;
        data?: { error?: string };
      };
      message?: string;
    };

    const status = err.response?.status;
    const apiMessage = err.response?.data?.error;
    const message = apiMessage || err.message || "Erro ao consultar o copiloto.";

    throw new Error(status ? `Falha na API (${status}): ${message}` : message);
  }
};