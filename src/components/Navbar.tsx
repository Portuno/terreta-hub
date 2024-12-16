import { useState, useEffect } from "react";
import { Menu, X, Search, User, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthModal } from "./AuthModal";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const menuItems = [
  { name: "Inicio", path: "/" },
  { name: "Productos", path: "/productos" },
  { name: "Recursos", path: "/recursos" },
  { name: "Eventos", path: "/eventos" },
  { name: "Foro", path: "/foro" },
  { name: "FAQ", path: "/faq" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        fetchUsername(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        fetchUsername(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUsername = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
    
    if (data) {
      setUsername(data.username);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión",
        variant: "destructive",
      });
    } else {
      toast({
        title: "¡Hasta pronto!",
        description: "Has cerrado sesión correctamente",
      });
      setSession(null);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary">
              TH
            </Link>
          </div>

          {/* Search bar */}
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-sm px-2 py-1 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100"
              >
                {item.name}
              </Link>
            ))}
            
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10">
                        {username ? username.substring(0, 2).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/perfil" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Ver Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/configuraciones" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuraciones</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                Iniciar Sesión
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="search"
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:text-primary hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {session ? (
                <div className="space-y-2 pt-2">
                  <Link
                    to="/perfil"
                    className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:text-primary hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Ver Perfil
                  </Link>
                  <Link
                    to="/configuraciones"
                    className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:text-primary hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Configuraciones
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    setShowAuthModal(true);
                  }}
                  className="w-full mt-2"
                >
                  Iniciar Sesión
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </nav>
  );
};