import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#000000',
                  brandAccent: '#333333',
                }
              }
            }
          }}
          theme="light"
          providers={["google"]}
          redirectTo={window.location.origin}
          localization={{
            variables: {
              sign_up: {
                email_label: "Correo electrónico",
                password_label: "Contraseña",
                button_label: "Registrarse",
                loading_button_label: "Registrando...",
                social_provider_text: "Iniciar sesión con {{provider}}",
                link_text: "¿No tienes una cuenta? Regístrate",
              },
              sign_in: {
                email_label: "Correo electrónico",
                password_label: "Contraseña",
                button_label: "Iniciar sesión",
                loading_button_label: "Iniciando sesión...",
                social_provider_text: "Iniciar sesión con {{provider}}",
                link_text: "¿Ya tienes una cuenta? Inicia sesión",
              },
            },
          }}
          // Handle errors through the onAuthStateChange event in your app
          onAuthStateChange={(event, session) => {
            if (event === "SIGNED_IN") {
              onClose();
            } else if (event === "USER_UPDATED") {
              console.log("user updated", session);
            } else if (event === "SIGNED_OUT") {
              console.log("signed out");
            } else if (event === "ERROR") {
              toast({
                title: "Error",
                description: "Hubo un problema al procesar tu solicitud. Por favor, intenta nuevamente.",
                variant: "destructive",
              });
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
};