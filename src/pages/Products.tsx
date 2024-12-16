import { Sidebar } from "../components/Sidebar";

const Products = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:ml-64">
        <main className="container mx-auto py-8 px-4">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-6">Productos</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Placeholder for product filters */}
              <div className="col-span-1 bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Filtros</h2>
                <div className="space-y-3">
                  {["Derecho", "Finanzas", "Tecnología", "Salud", "Comunidad", "Arte"].map((tag) => (
                    <label key={tag} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Placeholder for product grid */}
              <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="text-sm text-accent font-medium mb-2">Tecnología</div>
                    <h3 className="text-lg font-semibold mb-2">Producto {i}</h3>
                    <p className="text-gray-600 mb-4">
                      Una breve descripción del producto y sus características principales.
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Por: Usuario {i}</span>
                      <button className="text-primary hover:text-primary-dark">Ver más</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;