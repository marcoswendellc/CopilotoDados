import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, Zap, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const fluxoHorarioData = [
  { hora: "08h", fluxo: 450 },
  { hora: "10h", fluxo: 1200 },
  { hora: "12h", fluxo: 2800 },
  { hora: "14h", fluxo: 3200 },
  { hora: "16h", fluxo: 2600 },
  { hora: "18h", fluxo: 4100 },
  { hora: "20h", fluxo: 3400 },
  { hora: "22h", fluxo: 1800 },
];

const servicosData = [
  { servico: "Estacionamento", utilizacao: "78%", status: "Normal" },
  { servico: "Wi-Fi Público", utilizacao: "92%", status: "Alto" },
  { servico: "Banheiros", utilizacao: "65%", status: "Normal" },
  { servico: "Carrinhos", utilizacao: "45%", status: "Baixo" },
];

const Operacoes = () => {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Operações</h1>
          <p className="text-muted-foreground">
            Monitoramento de fluxo, serviços e infraestrutura em tempo real
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            icon={Users}
            title="Fluxo Atual"
            value="3.247"
            change="Em tempo real"
            changeType="neutral"
          />
          <MetricCard
            icon={Clock}
            title="Tempo Médio de Visita"
            value="2h 18min"
            change="+12min"
            changeType="positive"
          />
          <MetricCard
            icon={Activity}
            title="Taxa de Conversão"
            value="12,8%"
            change="+1,4%"
            changeType="positive"
          />
          <MetricCard
            icon={Zap}
            title="Serviços Ativos"
            value="98,5%"
            change="Operacional"
            changeType="positive"
          />
        </div>

        <Card className="border-border bg-card shadow-soft">
          <CardHeader>
            <CardTitle>Fluxo por Horário (Hoje)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={fluxoHorarioData}>
                <defs>
                  <linearGradient id="colorFluxo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hora" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="fluxo"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorFluxo)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-soft">
          <CardHeader>
            <CardTitle>Status dos Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {servicosData.map((servico, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground mb-1">{servico.servico}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-primary transition-all"
                          style={{ width: servico.utilizacao }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12">
                        {servico.utilizacao}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`ml-4 text-xs px-3 py-1 rounded-full ${
                      servico.status === "Alto"
                        ? "bg-yellow-100 text-yellow-700"
                        : servico.status === "Normal"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {servico.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border bg-card shadow-soft">
            <CardHeader>
              <CardTitle>Áreas de Maior Concentração</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="font-medium text-foreground">Praça de Alimentação</span>
                <span className="text-sm text-primary font-semibold">42%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="font-medium text-foreground">Corredor Principal</span>
                <span className="text-sm text-primary font-semibold">28%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="font-medium text-foreground">Cinemas</span>
                <span className="text-sm text-primary font-semibold">18%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="font-medium text-foreground">Âncoras</span>
                <span className="text-sm text-primary font-semibold">12%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-gradient-subtle shadow-soft">
            <CardHeader>
              <CardTitle>Alertas Operacionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm font-medium text-green-900">
                  ✓ Todos os sistemas funcionando normalmente
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <p className="text-sm font-medium text-yellow-900">
                  ⚠ Wi-Fi próximo da capacidade máxima
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm font-medium text-blue-900">
                  → Pico de fluxo esperado às 18h
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Operacoes;
