import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, User, Bell, Shield, Database, Palette } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Configuracoes = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Personalize sua experiência e gerencie preferências do sistema
          </p>
        </div>

        <Card className="border-border bg-card shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <CardTitle>Perfil do Usuário</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-foreground">Nome</label>
                <p className="text-sm text-muted-foreground mt-1">João Silva</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Cargo</label>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerente de Marketing
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <p className="text-sm text-muted-foreground mt-1">
                  joao.silva@buritishopping.com.br
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Nível de Acesso
                </label>
                <p className="text-sm text-muted-foreground mt-1">Head</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Editar Perfil
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <CardTitle>Notificações</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex-1">
                <p className="font-medium text-foreground">Alertas de Performance</p>
                <p className="text-sm text-muted-foreground">
                  Receba notificações sobre mudanças significativas nos KPIs
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex-1">
                <p className="font-medium text-foreground">Relatórios Automáticos</p>
                <p className="text-sm text-muted-foreground">
                  Receba relatórios semanais por email
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex-1">
                <p className="font-medium text-foreground">Insights da IA</p>
                <p className="text-sm text-muted-foreground">
                  Notificações sobre insights e recomendações
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex-1">
                <p className="font-medium text-foreground">Atualizações do Sistema</p>
                <p className="text-sm text-muted-foreground">
                  Novidades e melhorias do Copiloto
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <CardTitle>Aparência</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex-1">
                <p className="font-medium text-foreground">Modo Escuro</p>
                <p className="text-sm text-muted-foreground">
                  Ativar tema escuro da interface
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex-1">
                <p className="font-medium text-foreground">Densidade da Interface</p>
                <p className="text-sm text-muted-foreground">
                  Ajustar espaçamento e tamanho dos elementos
                </p>
              </div>
              <Button variant="outline" size="sm">
                Normal
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Database className="h-5 w-5 text-white" />
              </div>
              <CardTitle>Preferências de Dados</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="font-medium text-foreground mb-2">Shopping Padrão</p>
              <p className="text-sm text-muted-foreground mb-3">
                Selecione o shopping exibido por padrão
              </p>
              <Button variant="outline" size="sm">
                Buriti Shopping
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="font-medium text-foreground mb-2">Período de Análise</p>
              <p className="text-sm text-muted-foreground mb-3">
                Período padrão para gráficos e relatórios
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  7 dias
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                  30 dias
                </Button>
                <Button variant="outline" size="sm">
                  90 dias
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <CardTitle>Segurança</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex-1">
                <p className="font-medium text-foreground">Autenticação em Duas Etapas</p>
                <p className="text-sm text-muted-foreground">Requer código ao fazer login</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="font-medium text-foreground mb-2">Alterar Senha</p>
              <p className="text-sm text-muted-foreground mb-3">
                Última alteração: 15 dias atrás
              </p>
              <Button variant="outline" size="sm">
                Alterar Senha
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="font-medium text-foreground mb-2">Histórico de Acesso</p>
              <p className="text-sm text-muted-foreground mb-3">
                Visualize seus últimos acessos ao sistema
              </p>
              <Button variant="outline" size="sm">
                Ver Histórico
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Configuracoes;
