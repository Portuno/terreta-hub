import { Navbar } from "../components/Navbar";

const Forum = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <main className="container mx-auto py-8 px-4">
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-foreground">Foro</h1>
              <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Nueva Pregunta
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-500 text-center py-8">
                No hay discusiones en el foro en este momento.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Forum;