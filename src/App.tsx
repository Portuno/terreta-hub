import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import NewProduct from "./pages/NewProduct";
import Resources from "./pages/Resources";
import Events from "./pages/Events";
import Forum from "./pages/Forum";
import ForumTopic from "./pages/ForumTopic";
import FAQ from "./pages/FAQ";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ProductDetail from "./pages/ProductDetail";
import AdminUsers from "./pages/AdminUsers";
import { useState } from "react";

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/productos/nuevo" element={<NewProduct />} />
            <Route path="/productos/:id" element={<ProductDetail />} />
            <Route path="/recursos" element={<Resources />} />
            <Route path="/eventos" element={<Events />} />
            <Route path="/foro" element={<Forum />} />
            <Route path="/foro/:id" element={<ForumTopic />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/perfil/:username" element={<Profile />} />
            <Route path="/configuraciones" element={<Settings />} />
            <Route path="/admin/usuarios" element={<AdminUsers />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;