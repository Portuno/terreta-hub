import { Navbar } from "../components/Navbar";
import { TopProducts } from "../components/TopProducts";
import { TrendingTopics } from "../components/TrendingTopics";
import { UpcomingEvent } from "../components/UpcomingEvent";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <main className="container mx-auto py-8 px-4">
          <div className="animate-fade-in">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Impulsamos el talento de Valencia al futuro
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Descubre, conecta y crece con la comunidad de innovación valenciana
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary-dark">
                <Link to="/productos/nuevo">
                  Crea tu proyecto
                </Link>
              </Button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Top Productos de la Semana</h2>
                  <TopProducts />
                </section>
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Próximo Evento</h2>
                  <UpcomingEvent />
                </section>
              </div>

              {/* Right Column */}
              <div>
                <section>
                  <h2 className="text-2xl font-semibold mb-6">Temas Trending</h2>
                  <TrendingTopics />
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;