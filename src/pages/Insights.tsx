import { useMemo, useState } from "react";
import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  Calendar,
  Store,
  Sparkles,
} from "lucide-react";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOpenRouter } from "@/hooks/useOpenRouter";

type InsightPriority = "high" | "medium" | "low";
type InsightColor = "green" | "red" | "blue" | "yellow" | "purple" | "orange";

type InsightItem = {
  icon: typeof TrendingUp;
  type: string;
  title: string;
  description: string;
  priority: InsightPriority;
  color: InsightColor;
};

const insights: InsightItem[] = [
  {
    icon: TrendingUp,
    type: "Oportunidade",
    title: "Segmento com maior crescimento no mês",
    description:
      "O setor de alimentação apresentou crescimento de 24% nas últimas 4 semanas. Considere expandir este mix.",
    priority: "high",
    color: "green",
  },
  {
    icon: AlertTriangle,
    type: "Alerta",
    title: "Lojas com risco de queda nas vendas",
    description:
      "3 lojas no piso L2 apresentam queda de 15% no faturamento. Sugestão: análise de tráfego e ações de marketing localizadas.",
    priority: "high",
    color: "red",
  },
  {
    icon: Lightbulb,
    type: "Sugestão",
    title: "Eventos com melhor performance de captação",
    description:
      "Eventos gastronômicos geraram 45% mais cadastros que outros formatos. Recomenda-se aumentar frequência.",
    priority: "medium",
    color: "blue",
  },
  {
    icon: Calendar,
    type: "Oportunidade",
    title: "Dias de maior fluxo não aproveitados",
    description:
      "Quintas-feiras apresentam 20% mais fluxo que segundas, mas mesma oferta de eventos. Potencial de otimização.",
    priority: "medium",
    color: "yellow",
  },
  {
    icon: Target,
    type: "Insight",
    title: "Perfil de público emergente",
    description:
      "Aumento de 32% no público 18-24 anos nos últimos 2 meses. Ajustar comunicação e mix para este perfil.",
    priority: "medium",
    color: "purple",
  },
  {
    icon: Store,
    type: "Alerta",
    title: "Taxa de vacância acima da média",
    description:
      "A vacância do 3º piso está 8% acima da média histórica. Avaliar estratégias de atração de novos lojistas.",
    priority: "high",
    color: "orange",
  },
];

const priorityColors: Record<InsightPriority, string> = {
  high: "border-l-red-500",
  medium: "border-l-yellow-500",
  low: "border-l-green-500",
};

const iconColors: Record<InsightColor, string> = {
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
  yellow: "bg-yellow-100 text-yellow-700",
  purple: "bg-purple-100 text-purple-700",
  orange: "bg-orange-100 text-orange-700",
};

const Insights = () => {
  const [aiInsight, setAiInsight] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { mutate: generateInsight, isPending } = useOpenRouter();

  const prompt =
    "Gere um insight objetivo e acionável sobre oportunidades de crescimento no setor de alimentação de um shopping center, considerando vendas, fluxo e ações de marketing.";

  const handleGenerateInsight = () => {
    setErrorMessage("");
    setAiInsight("");

    generateInsight(
      [
        {
          role: "user",
          content: prompt,
        },
      ],
      {
        onSuccess: (response: string) => {
          setAiInsight(response);
        },
        onError: (error: unknown) => {
          const message =
            error instanceof Error
              ? error.message
              : "Erro ao gerar insight. Tente novamente.";

          console.error("Erro ao gerar insight:", message);
          setErrorMessage(message);
          setAiInsight("");
        },
      }
    );
  };

  const totalInsights = insights.length;
  const highPriorityCount = insights.filter((item) => item.priority === "high").length;
  const opportunityCount = insights.filter((item) => item.type === "Oportunidade").length;

  const aiStatusText = useMemo(() => {
    if (isPending) {
      return "Gerando insight com IA...";
    }

    if (errorMessage) {
      return errorMessage;
    }

    if (aiInsight) {
      return aiInsight;
    }

    return "";
  }, [isPending, errorMessage, aiInsight]);

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Insights Automáticos</h1>
          <p className="text-muted-foreground">
            Análises preditivas e recomendações geradas pela IA em tempo real.
          </p>

          <Button onClick={handleGenerateInsight} disabled={isPending} className="mt-4" type="button">
            <Sparkles className="mr-2 h-4 w-4" />
            {isPending ? "Gerando..." : "Gerar Insight com IA"}
          </Button>
        </div>

        {(aiInsight || errorMessage || isPending) && (
          <Card className="border-l-4 border-l-blue-500 bg-card shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    IA Gerado
                  </p>
                  <CardTitle className="mt-1 text-lg">Insight da IA</CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {aiStatusText}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border bg-card shadow-soft">
            <CardContent className="pt-6">
              <div className="space-y-2 text-center">
                <p className="text-3xl font-bold text-foreground">{totalInsights}</p>
                <p className="text-sm text-muted-foreground">Insights Ativos</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-soft">
            <CardContent className="pt-6">
              <div className="space-y-2 text-center">
                <p className="text-3xl font-bold text-red-600">{highPriorityCount}</p>
                <p className="text-sm text-muted-foreground">Alta Prioridade</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-soft">
            <CardContent className="pt-6">
              <div className="space-y-2 text-center">
                <p className="text-3xl font-bold text-green-600">{opportunityCount}</p>
                <p className="text-sm text-muted-foreground">Oportunidades</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {insights.map((insight, index) => (
            <Card
              key={`${insight.title}-${index}`}
              className={`border-l-4 ${priorityColors[insight.priority]} bg-card shadow-soft transition-all hover:shadow-elevated`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconColors[insight.color]}`}
                    >
                      <insight.icon className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        {insight.type}
                      </p>
                      <CardTitle className="mt-1 text-lg">{insight.title}</CardTitle>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      insight.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : insight.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {insight.priority === "high"
                      ? "Alta"
                      : insight.priority === "medium"
                      ? "Média"
                      : "Baixa"}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {insight.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border bg-gradient-subtle shadow-soft">
          <CardHeader>
            <CardTitle>Como funcionam os Insights Automáticos?</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Nossa IA analisa continuamente os dados de todos os shoppings para identificar:
            </p>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Tendências e padrões de comportamento</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Oportunidades de crescimento e otimização</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Alertas de riscos e problemas potenciais</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Recomendações acionáveis baseadas em dados</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Insights;