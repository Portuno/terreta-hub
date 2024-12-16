import { useState } from "react";
import { Menu, X, Home, BookOpen, Users, Calendar, MessageSquare, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

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
      {/* Mobile menu button - only visible on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-lg lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-xl transition-transform duration-300 ease-in-out z-40 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:w-64 w-3/4`}
      >
        <div className="p-6">
          <nav>
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="flex items-center space-x-3 text-gray-700 hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};