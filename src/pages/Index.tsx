import { Navbar } from "../components/Navbar";
import { Stats } from "../components/Stats";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16"> {/* Added padding-top to account for fixed navbar */}
        <main className="container mx-auto py-8 px-4">
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Impulsamos el talento de Valencia al futuro
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Descubre, conecta y crece con la comunidad de innovación valenciana
              </p>
              <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors">
                Crea tu proyecto
              </button>
            </div>
            
            <Stats />
            
            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Proyectos Destacados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="text-sm text-accent font-medium mb-2">Tecnología</div>
                    <h3 className="text-lg font-semibold mb-2">Proyecto {i}</h3>
                    <p className="text-gray-600 mb-4">
                      Una breve descripción del proyecto y sus objetivos principales.
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>12 colaboradores</span>
                      <span className="mx-2">•</span>
                      <span>Actualizado hace 2 días</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;