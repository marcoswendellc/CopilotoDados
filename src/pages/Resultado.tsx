import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Bot, Send, User } from "lucide-react";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useOpenRouter } from "@/hooks/useOpenRouter";
import type { ChatMessage } from "@/lib/openrouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Resultado = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q")?.trim() || "";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const { mutate: ask, isPending } = useOpenRouter();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!initialQuery) return;
    handleSend(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  const handleSend = (text?: string) => {
    const question = (text ?? input).trim();
    if (!question || isPending) return;

    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: question },
    ];

    setMessages(updatedMessages);
    setInput("");

    ask(updatedMessages, {
      onSuccess: (response) => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response },
        ]);
      },
      onError: () => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Erro ao consultar o copiloto.",
          },
        ]);
      },
    });
  };

  return (
    <AppLayout>
      <div className="mx-auto flex h-[calc(100vh-80px)] max-w-4xl flex-col px-4 py-6">
        <div className="mb-4 flex items-center">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border bg-card shadow-soft">
          <div className="border-b px-6 py-4">
            <h1 className="text-lg font-semibold">Copiloto de Dados</h1>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 px-6 py-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex max-w-[85%] items-start gap-3">
                  {msg.role === "assistant" && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Bot className="h-5 w-5" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border bg-background"
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>

                  {msg.role === "user" && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isPending && (
              <div className="text-sm text-muted-foreground">
                Pensando...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="flex items-center gap-2 border-t p-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua pergunta..."
              className="flex-1 rounded-xl border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />

            <Button onClick={() => handleSend()} disabled={isPending}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Resultado;