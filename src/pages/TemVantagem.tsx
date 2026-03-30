import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Users, Gift, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const cadastrosMensaisData = [
  { mes: "Jan", cadastros: 2840 },
  { mes: "Fev", cadastros: 3120 },
  { mes: "Mar", cadastros: 3580 },
  { mes: "Abr", cadastros: 3240 },
  { mes: "Mai", cadastros: 3890 },
  { mes: "Jun", cadastros: 4120 },
];

const fontesData = [
  { fonte: "Wi-Fi", cadastros: 8450, percentual: 42 },
  { fonte: "Eventos", cadastros: 5820, percentual: 29 },
  { fonte: "Totem", cadastros: 3640, percentual: 18 },
  { fonte: "Site", cadastros: 2280, percentual: 11 },
];

const TemVantagem = () => {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Tem Vantagem</h1>
          <p className="text-muted-foreground">
            Análise do programa de fidelidade e engajamento de clientes
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            icon={Users}
            title="Base Ativa"
            value="124.580"
            change="+8.420 este mês"
            changeType="positive"
          />
          <MetricCard
            icon={CreditCard}
            title="Taxa de Engajamento"
            value="67,3%"
            change="+4,2%"
            changeType="positive"
          />
          <MetricCard
            icon={Gift}
            title="Resgates no Mês"
            value="15.240"
            change="+12%"
            changeType="positive"
          />
          <MetricCard
            icon={TrendingUp}
            title="Ticket Médio"
            value="R$ 287"
            change="+R$ 32"
            changeType="positive"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border bg-card shadow-soft">
            <CardHeader>
              <CardTitle>Evolução de Cadastros</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cadastrosMensaisData}>
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
                  <Bar dataKey="cadastros" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-soft">
            <CardHeader>
              <CardTitle>Fontes de Cadastro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fontesData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{item.fonte}</span>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">
                          {item.cadastros.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.percentual}%</p>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary transition-all"
                        style={{ width: `${item.percentual}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-card shadow-soft">
          <CardHeader>
            <CardTitle>Segmentação de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-gradient-primary text-white">
                <p className="text-sm opacity-90 mb-1">VIP (Diamante)</p>
                <p className="text-3xl font-bold mb-2">2.840</p>
                <p className="text-xs opacity-75">Ticket médio: R$ 580</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary text-secondary-foreground">
                <p className="text-sm opacity-90 mb-1">Premium (Ouro)</p>
                <p className="text-3xl font-bold mb-2">12.450</p>
                <p className="text-xs opacity-75">Ticket médio: R$ 350</p>
              </div>
              <div className="p-4 rounded-lg bg-muted text-foreground">
                <p className="text-sm opacity-90 mb-1">Regular (Prata)</p>
                <p className="text-3xl font-bold mb-2">109.290</p>
                <p className="text-xs opacity-75">Ticket médio: R$ 180</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-subtle shadow-soft">
          <CardHeader>
            <CardTitle>Insights do Programa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="font-medium text-green-900 mb-1">✓ Crescimento Acelerado</p>
              <p className="text-sm text-green-700">
                Cadastros via Wi-Fi cresceram 32% após nova interface de captação
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="font-medium text-blue-900 mb-1">→ Oportunidade Identificada</p>
              <p className="text-sm text-blue-700">
                42% dos clientes VIP não resgataram benefícios nos últimos 30 dias
              </p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <p className="font-medium text-yellow-900 mb-1">⚡ Ação Recomendada</p>
              <p className="text-sm text-yellow-700">
                Criar campanha de reativação para 18.500 clientes inativos há 60+ dias
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TemVantagem;
