import axios from "axios";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const generateResponse = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const response = await axios.post("/api/copilot", { messages });
    return response.data?.answer || "Não consegui gerar resposta.";
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const backendError = error.response?.data?.error;
      const backendDetails = error.response?.data?.details;
      throw new Error(
        backendError
          ? `${backendError}${backendDetails ? `: ${JSON.stringify(backendDetails)}` : ""}`
          : error.message
      );
    }
    throw error;
  }
};