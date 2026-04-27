import axios from "axios";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const generateResponse = async (messages: ChatMessage[]): Promise<string> => {
  const response = await axios.post("/api/copilot", { messages });
  return response.data?.answer || "Não consegui gerar resposta.";
};