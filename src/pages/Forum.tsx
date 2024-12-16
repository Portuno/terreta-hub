import { Sidebar } from "../components/Sidebar";
import { MessageSquare, ThumbsUp } from "lucide-react";

const Forum = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:ml-64">
        <main className="container mx-auto py-8 px-4">
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-foreground">Foro</h1>
              <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Nueva Pregunta
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">Pregunta sobre desarrollo {i}</h3>
                      <p className="text-gray-600 mb-4">
                        Contenido de la pregunta y contexto adicional para entender mejor la consulta.
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4 text-gray-500">
                          <span>Por: Usuario {i}</span>
                          <span>Hace 2 días</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-primary">
                            <ThumbsUp size={16} />
                            <span>12</span>
                          </button>
                          <span className="text-gray-300">|</span>
                          <span className="text-gray-500">4 respuestas</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Forum;