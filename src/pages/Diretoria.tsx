import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, Building } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const comparativoShoppingsData = [
  { mes: "Jan", buriti: 42800, outro1: 38400, outro2: 45200 },
  { mes: "Fev", buriti: 45200, outro1: 41100, outro2: 46800 },
  { mes: "Mar", buriti: 48600, outro1: 43800, outro2: 48200 },
  { mes: "Abr", buriti: 46200, outro1: 42400, outro2: 47600 },
  { mes: "Mai", buriti: 51400, outro1: 46200, outro2: 52100 },
  { mes: "Jun", buriti: 54800, outro1: 49600, outro2: 55400 },
];

const kpisConsolidados = [
  { indicador: "Faturamento Total", valor: "R$ 24,8M", meta: "R$ 23,5M", status: "acima" },
  { indicador: "EBITDA", valor: "18,2%", meta: "16,5%", status: "acima" },
  { indicador: "Ocupação Média", valor: "94,7%", meta: "92,0%", status: "acima" },
  { indicador: "Fluxo Total", valor: "1,2M", meta: "1,1M", status: "acima" },
];

const Diretoria = () => {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Diretoria</h1>
          <p className="text-muted-foreground">
            Visão consolidada e comparativa de todos os shoppings da companhia
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            icon={DollarSign}
            title="Faturamento Consolidado"
            value="R$ 74,2M"
            change="+12,4%"
            changeType="positive"
          />
          <MetricCard
            icon={Building}
            title="Unidades em Operação"
            value="3"
            change="100% operacionais"
            changeType="positive"
          />
          <MetricCard
            icon={Users}
            title="Fluxo Total"
            value="3,8M"
            change="+8,2%"
            changeType="positive"
          />
          <MetricCard
            icon={TrendingUp}
            title="EBITDA Médio"
            value="18,2%"
            change="+1,7pp"
            changeType="positive"
          />
        </div>

        <Card className="border-border bg-card shadow-soft">
          <CardHeader>
            <CardTitle>Performance Comparativa - Fluxo Mensal (em milhares)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={comparativoShoppingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="buriti"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  name="Buriti Shopping"
                />
                <Line
                  type="monotone"
                  dataKey="outro1"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  name="Shopping Alpha"
                />
                <Line
                  type="monotone"
                  dataKey="outro2"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  name="Shopping Beta"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-soft">
          <CardHeader>
            <CardTitle>KPIs Consolidados - Buriti Shopping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {kpisConsolidados.map((kpi, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-foreground flex-1">{kpi.indicador}</span>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Meta</p>
                      <p className="font-semibold text-foreground">{kpi.meta}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Real</p>
                      <p className="text-lg font-bold text-green-600">{kpi.valor}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                      ✓ Acima
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border bg-card shadow-soft hover:shadow-elevated transition-all">
            <CardHeader>
              <CardTitle className="text-base">Buriti Shopping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Faturamento</span>
                <span className="font-semibold text-foreground">R$ 24,8M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Fluxo</span>
                <span className="font-semibold text-foreground">1,2M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ocupação</span>
                <span className="font-semibold text-green-600">94,7%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-soft hover:shadow-elevated transition-all">
            <CardHeader>
              <CardTitle className="text-base">Shopping Alpha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Faturamento</span>
                <span className="font-semibold text-foreground">R$ 22,4M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Fluxo</span>
                <span className="font-semibold text-foreground">1,1M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ocupação</span>
                <span className="font-semibold text-green-600">92,3%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-soft hover:shadow-elevated transition-all">
            <CardHeader>
              <CardTitle className="text-base">Shopping Beta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Faturamento</span>
                <span className="font-semibold text-foreground">R$ 27,0M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Fluxo</span>
                <span className="font-semibold text-foreground">1,5M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ocupação</span>
                <span className="font-semibold text-green-600">96,2%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-l-4 border-l-primary bg-gradient-subtle shadow-elevated">
          <CardHeader>
            <CardTitle>Destaques Executivos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 rounded-lg bg-card border border-border">
              <p className="font-medium text-foreground mb-2">
                📊 Todas as Unidades Acima das Metas
              </p>
              <p className="text-sm text-muted-foreground">
                Os 3 shoppings superaram as metas trimestrais de faturamento e ocupação
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <p className="font-medium text-foreground mb-2">
                🎯 Buriti Lidera em Crescimento
              </p>
              <p className="text-sm text-muted-foreground">
                Crescimento de 12,4% no faturamento, melhor performance da companhia
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <p className="font-medium text-foreground mb-2">
                💡 Oportunidade: Replicar Cases de Sucesso
              </p>
              <p className="text-sm text-muted-foreground">
                Estratégias de marketing do Buriti podem ser adaptadas para outras unidades
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Diretoria;
