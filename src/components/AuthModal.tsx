import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const AuthModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUsernameSubmit = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', user.id);

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Error",
            description: "Este nombre de usuario ya está en uso",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "¡Éxito!",
        description: "Tu nombre de usuario ha sido guardado",
      });
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Hubo un error al guardar tu nombre de usuario",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session?.user.id)
        .single();

      if (!profile?.username) {
        setShowUsernameForm(true);
      } else {
        onClose();
      }
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showUsernameForm ? "Elige tu nombre de usuario" : "Iniciar sesión"}
          </DialogTitle>
        </DialogHeader>
        
        {showUsernameForm ? (
          <div className="space-y-4">
            <Input
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button 
              onClick={handleUsernameSubmit} 
              disabled={!username.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? "Guardando..." : "Guardar nombre de usuario"}
            </Button>
          </div>
        ) : (
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#6E59A5',
                    brandAccent: '#4A3B80',
                  },
                },
              },
            }}
            providers={["google"]}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Correo electrónico",
                  password_label: "Contraseña",
                  button_label: "Iniciar sesión",
                },
                sign_up: {
                  email_label: "Correo electrónico",
                  password_label: "Contraseña",
                  button_label: "Registrarse",
                },
              },
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};