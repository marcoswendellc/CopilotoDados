import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Resultado from "./pages/Resultado";
import Marketing from "./pages/Marketing";
import Comercial from "./pages/Comercial";
import Operacoes from "./pages/Operacoes";
import TemVantagem from "./pages/TemVantagem";
import Diretoria from "./pages/Diretoria";
import Relatorios from "./pages/Relatorios";
import Insights from "./pages/Insights";
import Seguranca from "./pages/Seguranca";
import Integracao from "./pages/Integracao";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/resultado" element={<Resultado />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/comercial" element={<Comercial />} />
          <Route path="/operacoes" element={<Operacoes />} />
          <Route path="/tem-vantagem" element={<TemVantagem />} />
          <Route path="/diretoria" element={<Diretoria />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/seguranca" element={<Seguranca />} />
          <Route path="/integracao" element={<Integracao />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;