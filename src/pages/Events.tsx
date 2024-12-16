import { Sidebar } from "../components/Sidebar";
import { Calendar } from "lucide-react";

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:ml-64">
        <main className="container mx-auto py-8 px-4">
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-foreground">Eventos</h1>
              <div className="flex space-x-3">
                <button className="bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  Presencial
                </button>
                <button className="bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  Online
                </button>
                <button className="bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  Gratuitos
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Calendar className="w-6 h-6 text-accent" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">28 Feb 2024</p>
                      <p className="text-gray-500">18:00 - 20:00</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Evento {i}</h3>
                  <p className="text-gray-600 mb-4">
                    Descripción breve del evento y sus objetivos principales.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Valencia</span>
                    <button className="text-primary hover:text-primary-dark font-medium">
                      Inscribirse
                    </button>
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

export default Events;