import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthModal } from "./AuthModal";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";
import { SearchBar } from "./SearchBar";

const menuItems = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/productos" },
  { name: "Resources", path: "/recursos" },
  { name: "Events", path: "/eventos" },
  { name: "Forum", path: "/foro" },
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
        description: "Could not sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "See you soon!",
        description: "You have successfully signed out",
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
            <SearchBar />
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
              <UserMenu username={username} onLogout={handleLogout} />
            ) : (
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                Sign In
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
        <MobileMenu
          isOpen={isOpen}
          menuItems={menuItems}
          session={session}
          username={username}
          setShowAuthModal={setShowAuthModal}
          handleLogout={handleLogout}
          setIsOpen={setIsOpen}
        />
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </nav>
  );
};