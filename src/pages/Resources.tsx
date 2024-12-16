import { Sidebar } from "../components/Sidebar";
import { BookOpen, GraduationCap, Link } from "lucide-react";

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:ml-64">
        <main className="container mx-auto py-8 px-4">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-6">Recursos</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Guías */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Guías</h2>
                </div>
                <ul className="space-y-3">
                  {["Cómo conseguir financiación", "Primeros pasos en startups", "Guía legal básica"].map((guide) => (
                    <li key={guide} className="hover:text-primary cursor-pointer">{guide}</li>
                  ))}
                </ul>
              </div>

              {/* Cursos */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold">Cursos</h2>
                </div>
                <ul className="space-y-3">
                  {["Desarrollo Web", "Marketing Digital", "Diseño UX/UI"].map((course) => (
                    <li key={course} className="hover:text-accent cursor-pointer">{course}</li>
                  ))}
                </ul>
              </div>

              {/* Enlaces Útiles */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Link className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Enlaces Útiles</h2>
                </div>
                <ul className="space-y-3">
                  {["Incubadoras", "Aceleradoras", "Grants disponibles"].map((link) => (
                    <li key={link} className="hover:text-primary cursor-pointer">{link}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Resources;