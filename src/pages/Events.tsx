import { Navbar } from "../components/Navbar";

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <main className="container mx-auto py-8 px-4">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-6">Eventos</h1>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-500 text-center py-8">
                No hay eventos programados en este momento.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Events;