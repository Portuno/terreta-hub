import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { SearchBar } from "./SearchBar";

interface MobileMenuProps {
  isOpen: boolean;
  menuItems: Array<{ name: string; path: string; }>;
  session: any;
  username: string;
  setShowAuthModal: (show: boolean) => void;
  handleLogout: () => Promise<void>;
  setIsOpen: (isOpen: boolean) => void;
}

export const MobileMenu = ({
  isOpen,
  menuItems,
  session,
  username,
  setShowAuthModal,
  handleLogout,
  setIsOpen
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1">
        {/* Mobile search */}
        <div className="relative mb-4">
          <SearchBar />
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
              to={`/perfil/${username}`}
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
  );
};