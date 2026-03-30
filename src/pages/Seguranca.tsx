import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Users, Database, CheckCircle, AlertTriangle } from "lucide-react";

const niveis = [
  {
    nivel: "Diretoria",
    descricao: "Acesso total a todos os dados e funcionalidades",
    usuarios: 5,
    cor: "red",
  },
  {
    nivel: "Head",
    descricao: "Acesso completo aos dados da sua área",
    usuarios: 12,
    cor: "orange",
  },
  {
    nivel: "Gerente",
    descricao: "Acesso a relatórios e consultas da sua unidade",
    usuarios: 28,
    cor: "yellow",
  },
  {
    nivel: "Analista",
    descricao: "Acesso a consultas e visualizações básicas",
    usuarios: 47,
    cor: "green",
  },
];

const segurancaItens = [
  {
    icon: Lock,
    titulo: "Criptografia de Ponta a Ponta",
    descricao: "Todos os dados são criptografados em trânsito e em repouso com AES-256",
    status: "Ativo",
  },
  {
    icon: Database,
    titulo: "Isolamento de Dados",
    descricao: "Cada shopping tem seu ambiente isolado, garantindo privacidade total",
    status: "Ativo",
  },
  {
    icon: Users,
    titulo: "Autenticação Multi-Fator",
    descricao: "Login seguro com verificação em duas etapas obrigatória",
    status: "Ativo",
  },
  {
    icon: CheckCircle,
    titulo: "Auditoria Completa",
    descricao: "Registro de todos os acessos e consultas para rastreabilidade",
    status: "Ativo",
  },
];

const Seguranca = () => {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Segurança e Permissões</h1>
          <p className="text-muted-foreground">
            Controle de acesso e proteção de dados corporativos
          </p>
        </div>

        <Card className="border-l-4 border-l-green-500 bg-card shadow-elevated">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Ambiente Seguro e Auditável
                </h3>
                <p className="text-sm text-muted-foreground">
                  Todos os dados são criptografados, isolados por unidade e com controle
                  rigoroso de acesso por nível hierárquico.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-600">Protegido</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Níveis de Acesso
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {niveis.map((nivel, index) => (
              <Card key={index} className="border-border bg-card shadow-soft">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{nivel.nivel}</CardTitle>
                    <span className="text-2xl font-bold text-muted-foreground">
                      {nivel.usuarios}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{nivel.descricao}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{nivel.usuarios} usuários ativos</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Recursos de Segurança
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {segurancaItens.map((item, index) => (
              <Card
                key={index}
                className="border-border bg-card shadow-soft hover:shadow-elevated transition-all"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{item.titulo}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.descricao}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="border-border bg-gradient-subtle shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Políticas de Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  Senhas devem ser alteradas a cada 90 dias e conter no mínimo 12 caracteres
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  Tentativas de login são limitadas a 5 por hora para prevenir acessos não autorizados
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  Todos os acessos são registrados e podem ser auditados pela equipe de TI
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>
                  Dados sensíveis são anonimizados em relatórios de níveis inferiores
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Seguranca;
