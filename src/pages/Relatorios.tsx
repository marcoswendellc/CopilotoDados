import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, TrendingUp, Store, Megaphone, PieChart } from "lucide-react";

const relatorios = [
  {
    icon: Calendar,
    title: "Relatório Mensal do Buriti Shopping",
    description: "Consolidado de fluxo, vendas e eventos",
    periodo: "Outubro 2024",
    status: "Disponível",
  },
  {
    icon: TrendingUp,
    title: "Relatório Comparativo entre Shoppings",
    description: "Análise de performance por unidade",
    periodo: "Q3 2024",
    status: "Disponível",
  },
  {
    icon: Store,
    title: "Relatório Comercial",
    description: "Ocupação, mix e vacância",
    periodo: "Setembro 2024",
    status: "Disponível",
  },
  {
    icon: Megaphone,
    title: "Relatório de Campanhas",
    description: "ROI e performance de marketing",
    periodo: "Últimos 90 dias",
    status: "Disponível",
  },
  {
    icon: PieChart,
    title: "Relatório de Desempenho Geral",
    description: "Visão consolidada de todos os KPIs",
    periodo: "Anual 2024",
    status: "Em geração",
  },
];

const Relatorios = () => {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Relatórios Automáticos</h1>
          <p className="text-muted-foreground">
            Acesse relatórios pré-configurados ou gere novos sob demanda
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {relatorios.map((relatorio, index) => (
            <Card
              key={index}
              className="border-border bg-card shadow-soft hover:shadow-elevated transition-all"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <relatorio.icon className="h-6 w-6 text-white" />
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      relatorio.status === "Disponível"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {relatorio.status}
                  </span>
                </div>
                <CardTitle className="text-base">{relatorio.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {relatorio.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{relatorio.periodo}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    disabled={relatorio.status !== "Disponível"}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-primary hover:opacity-90"
                    disabled={relatorio.status !== "Disponível"}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border bg-gradient-subtle shadow-soft">
          <CardHeader>
            <CardTitle>Gerar Novo Relatório</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Utilize o campo de pesquisa na página inicial para gerar relatórios
              personalizados. Exemplos:
            </p>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-card border border-border">
                <p className="text-sm font-medium text-foreground">
                  "Gere um relatório de fluxo dos últimos 30 dias"
                </p>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border">
                <p className="text-sm font-medium text-foreground">
                  "Compare o desempenho de vendas entre todos os shoppings"
                </p>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border">
                <p className="text-sm font-medium text-foreground">
                  "Relatório completo de campanhas de marketing do Q3"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Relatorios;
