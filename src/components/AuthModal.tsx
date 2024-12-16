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
        />
      </DialogContent>
    </Dialog>
  );
};