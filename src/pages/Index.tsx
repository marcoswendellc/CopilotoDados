import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, DollarSign, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QueryCard } from "@/components/QueryCard";
import { AppLayout } from "@/components/layout/AppLayout";
import buritiLogo from "@/assets/buriti-logo.jpg";

const exampleQueries = [
  {
    icon: Users,
    title: "Qual foi o fluxo de visitantes do Buriti nos últimos 7 dias?",
  },
  {
    icon: DollarSign,
    title: "Qual foi o custo e retorno da campanha X?",
  },
  {
    icon: TrendingUp,
    title: "Mostre as lojas com maior queda de performance no mês.",
  },
  {
    icon: Calendar,
    title: "Quantos cadastros vieram do Wi-Fi em março?",
  },
];

const Index = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/resultado?q=${encodeURIComponent(query)}`);
    }
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src={buritiLogo} 
              alt="Buriti Shopping" 
              className="h-24 w-auto object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Copiloto de Dados
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Acesso rápido, seguro e integrado aos dados internos de todos os
            shoppings da companhia.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Digite sua pergunta sobre os dados de campanha"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-14 text-base bg-card border-border shadow-soft"
            />
            <Button
              onClick={handleSearch}
              size="lg"
              className="h-14 px-8 bg-gradient-primary hover:opacity-90 transition-all shadow-elevated"
            >
              <Search className="mr-2 h-5 w-5" />
              Consultar
            </Button>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>Ambiente seguro - dados criptografados e isolados</span>
          </div>
        </div>

        {/* Example Queries */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Exemplos de consultas
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {exampleQueries.map((example, index) => (
              <QueryCard
                key={index}
                icon={example.icon}
                title={example.title}
                onClick={() => handleExampleClick(example.title)}
              />
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-3 pt-8">
          <div className="text-center space-y-2 p-6 rounded-lg bg-card border border-border shadow-soft">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-primary mb-2">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground">
              Consulta em Tempo Real
            </h3>
            <p className="text-sm text-muted-foreground">
              Acesse dados atualizados instantaneamente via API segura
            </p>
          </div>

          <div className="text-center space-y-2 p-6 rounded-lg bg-card border border-border shadow-soft">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-primary mb-2">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground">Para Toda Equipe</h3>
            <p className="text-sm text-muted-foreground">
              Insights acessíveis para marketing, comercial e diretoria
            </p>
          </div>

          <div className="text-center space-y-2 p-6 rounded-lg bg-card border border-border shadow-soft">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-primary mb-2">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground">
              Relatórios Automáticos
            </h3>
            <p className="text-sm text-muted-foreground">
              Geração instantânea de relatórios prontos para exportar
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
