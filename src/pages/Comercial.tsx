import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, TrendingUp, Building, Package } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const ocupacaoData = [
  { name: "Ocupados", value: 142, color: "hsl(var(--primary))" },
  { name: "Vagos", value: 8, color: "hsl(var(--muted))" },
];

const mixData = [
  { categoria: "Alimentação", lojas: 38, percentual: 25 },
  { categoria: "Moda", lojas: 52, percentual: 35 },
  { categoria: "Serviços", lojas: 28, percentual: 19 },
  { categoria: "Entretenimento", lojas: 15, percentual: 10 },
  { categoria: "Outros", lojas: 17, percentual: 11 },
];

const Comercial = () => {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Comercial</h1>
          <p className="text-muted-foreground">
            Acompanhe ocupação, mix de lojas e performance comercial
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            icon={Store}
            title="Taxa de Ocupação"
            value="94,7%"
            change="+1,2%"
            changeType="positive"
          />
          <MetricCard
            icon={Building}
            title="Total de Lojas"
            value="150"
            change="+3 este mês"
            changeType="positive"
          />
          <MetricCard
            icon={Package}
            title="Lojas Vagas"
            value="8"
            change="-2"
            changeType="positive"
          />
          <MetricCard
            icon={TrendingUp}
            title="Faturamento Médio"
            value="R$ 2,4M"
            change="+6%"
            changeType="positive"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border bg-card shadow-soft">
            <CardHeader>
              <CardTitle>Distribuição de Ocupação</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ocupacaoData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ocupacaoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-soft">
            <CardHeader>
              <CardTitle>Mix de Lojas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mixData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {item.categoria}
                      </span>
                      <span className="text-muted-foreground">
                        {item.lojas} lojas ({item.percentual}%)
                      </span>
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
            <CardTitle>Destaques Comerciais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="font-medium text-green-900 mb-1">✓ Meta de Ocupação Atingida</p>
              <p className="text-sm text-green-700">
                A taxa de ocupação de 94,7% supera a meta trimestral de 92%
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="font-medium text-blue-900 mb-1">→ Expansão do Mix</p>
              <p className="text-sm text-blue-700">
                3 novas marcas premium confirmadas para o próximo trimestre
              </p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <p className="font-medium text-yellow-900 mb-1">⚠ Atenção: Piso L2</p>
              <p className="text-sm text-yellow-700">
                5 das 8 vagas estão concentradas no 2º piso - avaliar estratégias
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Comercial;
