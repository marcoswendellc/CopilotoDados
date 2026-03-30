import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Server, Zap, CheckCircle, Clock } from "lucide-react";

const integracoes = [
  {
    icon: Database,
    titulo: "Consulta Direta via API",
    descricao: "Conexão em tempo real com o banco de dados corporativo",
    status: "Conectado",
    latencia: "< 100ms",
  },
  {
    icon: Server,
    titulo: "Dados em Tempo Real",
    descricao: "Sincronização contínua de todas as informações",
    status: "Ativo",
    latencia: "Instantâneo",
  },
  {
    icon: Zap,
    titulo: "Integração Auditável e Segura",
    descricao: "Todos os acessos são registrados e monitorados",
    status: "Protegido",
    latencia: "N/A",
  },
];

const fontesDados = [
  { nome: "Sistema de Fluxo de Pessoas", status: "Conectado", atualizacao: "2 min" },
  { nome: "Sistema de Vendas (POS)", status: "Conectado", atualizacao: "1 min" },
  { nome: "Sistema de Campanhas", status: "Conectado", atualizacao: "5 min" },
  { nome: "Sistema de Wi-Fi Analytics", status: "Conectado", atualizacao: "3 min" },
  { nome: "Sistema de Eventos", status: "Conectado", atualizacao: "10 min" },
  { nome: "Sistema de Ocupação", status: "Conectado", atualizacao: "1 hora" },
];

const Integracao = () => {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Integração com Banco de Dados
          </h1>
          <p className="text-muted-foreground">
            Conectado ao ecossistema de dados corporativos em tempo real
          </p>
        </div>

        <Card className="border-l-4 border-l-green-500 bg-card shadow-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Database className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Sistema Totalmente Integrado
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  O Copiloto de Dados está conectado diretamente aos sistemas
                  corporativos, garantindo informações sempre atualizadas e precisas.
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium text-green-600">
                    6 fontes ativas • Latência média: 85ms
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {integracoes.map((integracao, index) => (
            <Card
              key={index}
              className="border-border bg-card shadow-soft hover:shadow-elevated transition-all"
            >
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <integracao.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {integracao.titulo}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {integracao.descricao}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">
                        {integracao.status}
                      </span>
                      {integracao.latencia !== "N/A" && (
                        <span className="text-muted-foreground">
                          {integracao.latencia}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Fontes de Dados Conectadas
          </h2>
          <Card className="border-border bg-card shadow-soft">
            <CardContent className="pt-6">
              <div className="space-y-3">
                {fontesDados.map((fonte, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-foreground">{fonte.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          Última atualização: {fonte.atualizacao} atrás
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                      {fonte.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-gradient-subtle shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Como Funciona a Integração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>
                  <strong>Conexão Segura:</strong> API REST com autenticação e criptografia
                  end-to-end
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>
                  <strong>Sincronização:</strong> Dados são atualizados automaticamente em
                  intervalos configuráveis por fonte
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>
                  <strong>Cache Inteligente:</strong> Informações frequentes são
                  armazenadas temporariamente para performance
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">4.</span>
                <span>
                  <strong>Auditoria:</strong> Cada consulta é registrada com timestamp,
                  usuário e tipo de acesso
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Integracao;
