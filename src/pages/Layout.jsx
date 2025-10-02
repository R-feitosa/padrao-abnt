

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, Upload, Library, LogOut, User as UserIcon, Sun, Moon } from "lucide-react";
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
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { User } from "@/api/entities";
import Logo from "./components/Logo";

const navigationItems = [
  {
    title: "Upload",
    url: createPageUrl("Home"),
    icon: Upload,
  },
  {
    title: "Meus Documentos",
    url: createPageUrl("MyDocuments"),
    icon: Library,
  },
  {
    title: "Meu Perfil",
    url: createPageUrl("Profile"),
    icon: UserIcon,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    loadUser();
    // Carrega preferência de tema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      // Ensure light theme is active if nothing is saved or if it's explicitly 'light'
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      setUser(null);
      window.location.href = createPageUrl("Login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --primary: #7d1f3c;
            --primary-light: #a02952;
            --primary-dark: #5c1729;
            --accent: #8b2847;
            --background: #faf8f5;
            --surface: #ffffff;
            --cream: #f5efe6;
            --cream-dark: #e8dfd3;
            --text-primary: #2d1e1e;
            --text-secondary: #6b5c5c;
            --border: #e8dfd3;
          }
          
          .dark {
            --primary: #a02952;
            --primary-light: #c03366;
            --primary-dark: #7d1f3c;
            --accent: #8b2847;
            --background: #0a0a0a;
            --surface: #1a1a1a;
            --cream: #2a2a2a;
            --cream-dark: #333333;
            --text-primary: #ffffff;
            --text-secondary: #a0a0a0;
            --border: #333333;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            transition: background-color 0.3s ease, color 0.3s ease;
          }

          .abnt-document {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            text-align: justify;
          }
        `}
      </style>
      <div className="min-h-screen flex w-full" style={{backgroundColor: 'var(--background)'}}>
        <Sidebar className="border-r" style={{borderColor: 'var(--border)', backgroundColor: 'var(--surface)'}}>
          <SidebarHeader className="border-b p-6" style={{borderColor: 'var(--border)'}}>
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <div>
                <h2 className="font-bold text-xl" style={{color: 'var(--text-primary)'}}>Padrão ABNT</h2>
                <p className="text-xs" style={{color: 'var(--text-secondary)'}}>Formatação ABNT automática</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider px-3 py-2" style={{color: 'var(--text-secondary)'}}>
                Navegação
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`rounded-lg mb-1 transition-all duration-200 ${
                          location.pathname === item.url 
                            ? 'font-medium' 
                            : ''
                        }`}
                        style={{
                          backgroundColor: location.pathname === item.url ? 'var(--primary)' : 'transparent',
                          color: location.pathname === item.url ? 'white' : 'var(--text-primary)'
                        }}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider px-3 py-2" style={{color: 'var(--text-secondary)'}}>
                Preferências
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2"
                  onClick={toggleDarkMode}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)'
                  }}
                >
                  {darkMode ? (
                    <>
                      <Sun className="w-5 h-5 mr-3" />
                      <span>Modo Claro</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-5 h-5 mr-3" />
                      <span>Modo Escuro</span>
                    </>
                  )}
                </Button>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider px-3 py-2" style={{color: 'var(--text-secondary)'}}>
                Recursos
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-3 rounded-lg" style={{backgroundColor: 'var(--cream)', border: '1px solid var(--cream-dark)'}}>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4" style={{color: 'var(--primary)'}} />
                    <span className="text-sm font-medium" style={{color: 'var(--primary)'}}>Formatos suportados</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{color: 'var(--text-secondary)'}}>
                    Word (.docx), PDF, e arquivos de texto (.txt)
                  </p>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4" style={{borderColor: 'var(--border)'}}>
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white overflow-hidden" style={{backgroundColor: 'var(--primary)'}}>
                  {user?.profile_photo_url ? (
                    <img 
                      src={user.profile_photo_url} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.full_name?.[0]?.toUpperCase() || 'U'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" style={{color: 'var(--text-primary)'}}>
                    {user?.full_name || 'Usuário'}
                  </p>
                  <p className="text-xs truncate" style={{color: 'var(--text-secondary)'}}>
                    {user?.email || 'Formatação ABNT'}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)'
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair da conta
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b px-6 py-4 md:hidden" style={{borderColor: 'var(--border)'}}>
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              <div className="flex items-center gap-3">
                <Logo size="sm" />
                <h1 className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>Padrão ABNT</h1>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

