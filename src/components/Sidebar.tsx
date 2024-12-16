import { useState } from "react";
import { Menu, X, Home, BookOpen, Users, Calendar, MessageSquare, HelpCircle, Search } from "lucide-react";

const menuItems = [
  { name: "Inicio", icon: Home, path: "/" },
  { name: "Productos", icon: Users, path: "/productos" },
  { name: "Recursos", icon: BookOpen, path: "/recursos" },
  { name: "Eventos", icon: Calendar, path: "/eventos" },
  { name: "Foro", icon: MessageSquare, path: "/foro" },
  { name: "FAQ", icon: HelpCircle, path: "/faq" },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out z-40 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:w-64 w-3/4`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary mb-8">TerretaHub</h1>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <nav>
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    className="flex items-center space-x-3 text-gray-700 hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-100"
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};