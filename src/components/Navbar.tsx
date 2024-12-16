import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { Link } from "react-router-dom";

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
  const [showAuthOptions, setShowAuthOptions] = useState(false);

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
            
            {/* Login Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAuthOptions(!showAuthOptions)}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-dark transition-colors"
              >
                Iniciar Sesión
              </button>
              
              {showAuthOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Iniciar Sesión
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Registrarse
                  </button>
                </div>
              )}
            </div>
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
              
              {/* Mobile login buttons */}
              <div className="pt-2 space-y-1">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Iniciar Sesión
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Registrarse
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};