import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  Store,
  Settings as SettingsIcon,
  Shield,
  Database,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import buritiLogo from "@/assets/buriti-logo.jpg";

const navItems = [
  { title: "Geral", url: "/", icon: LayoutDashboard },
  { title: "Marketing", url: "/marketing", icon: Megaphone },
  { title: "Comercial", url: "/comercial", icon: Store },
  { title: "Operações", url: "/operacoes", icon: TrendingUp },
  { title: "Tem Vantagem", url: "/tem-vantagem", icon: CreditCard },
  { title: "Diretoria", url: "/diretoria", icon: Shield },
  { title: "Relatórios", url: "/relatorios", icon: Database },
  { title: "Insights", url: "/insights", icon: TrendingUp },
];

const configItems = [
  { title: "Segurança", url: "/seguranca", icon: Shield },
  { title: "Integração", url: "/integracao", icon: Database },
  { title: "Configurações", url: "/configuracoes", icon: SettingsIcon },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-3">
          <img 
            src={buritiLogo} 
            alt="Buriti Shopping" 
            className="h-10 w-auto object-contain"
          />
          <div>
            <h2 className="font-semibold text-sidebar-foreground">Copiloto</h2>
            <p className="text-xs text-muted-foreground">2026</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
