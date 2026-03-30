import { useMutation } from "@tanstack/react-query";
import { generateResponse, type ChatMessage } from "@/lib/openrouter";

export const useOpenRouter = () => {
  return useMutation({
    mutationFn: (messages: ChatMessage[]) => generateResponse(messages),
  });
};