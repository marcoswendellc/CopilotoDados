import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, Users, DollarSign, Target, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const campanhasData = [
  { nome: "Dia das Mães", leads: 1240, custo: 12000, roi: 3.2 },
  { nome: "Black Friday", leads: 3580, custo: 28000, roi: 4.8 },
  { nome: "Natal 2024", leads: 2890, custo: 22000, roi: 4.1 },
  { nome: "Volta às Aulas", leads: 1650, custo: 15000, roi: 3.6 },
];

const Marketing = () => {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Marketing</h1>
          <p className="text-muted-foreground">
            Acompanhe o desempenho das campanhas e ROI em tempo real
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            icon={Megaphone}
            title="Campanhas Ativas"
            value="12"
            change="+3 este mês"
            changeType="positive"
          />
          <MetricCard
            icon={Users}
            title="Novos Leads"
            value="9.360"
            change="+18%"
            changeType="positive"
          />
          <MetricCard
            icon={DollarSign}
            title="Investimento Total"
            value="R$ 77.000"
            change="-5%"
            changeType="positive"
          />
          <MetricCard
            icon={Target}
            title="ROI Médio"
            value="3.9x"
            change="+0.4"
            changeType="positive"
          />
        </div>

        <Card className="border-border bg-card shadow-soft">
          <CardHeader>
            <CardTitle>Performance por Campanha</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={campanhasData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="nome" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="leads" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {campanhasData.map((campanha, index) => (
            <Card key={index} className="border-border bg-card shadow-soft hover:shadow-elevated transition-all">
              <CardHeader>
                <CardTitle className="text-lg">{campanha.nome}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Leads</p>
                    <p className="text-2xl font-bold text-foreground">
                      {campanha.leads.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Custo</p>
                    <p className="text-2xl font-bold text-foreground">
                      R$ {(campanha.custo / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ROI</p>
                    <p className="text-2xl font-bold text-green-600">
                      {campanha.roi}x
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Custo por Lead: R$ {(campanha.custo / campanha.leads).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Marketing;
