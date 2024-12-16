import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "¿Qué es TerretaHub?",
      answer: "TerretaHub es una plataforma que conecta a innovadores, emprendedores y entusiastas de tecnologías emergentes en Valencia. Nuestro objetivo es impulsar la colaboración y el crecimiento del ecosistema tecnológico local."
    },
    {
      question: "¿Cómo puedo registrarme?",
      answer: "Para registrarte, haz clic en el botón 'Iniciar sesión' en la esquina superior derecha y selecciona 'Crear cuenta'. Completa el formulario con tus datos básicos y ¡listo!"
    },
    {
      question: "¿Cómo publicar un producto o evento?",
      answer: "Una vez registrado, puedes crear un nuevo producto o evento desde tu panel de usuario. Asegúrate de incluir toda la información relevante y etiquetas apropiadas para mayor visibilidad."
    },
    {
      question: "¿Cuáles son las normas del foro?",
      answer: "Nuestro foro se basa en el respeto mutuo y la colaboración constructiva. No se permite spam, contenido ofensivo o publicidad no autorizada. Todas las preguntas y respuestas deben ser relevantes para la comunidad."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <Sidebar />
        <div className="lg:ml-64">
          <main className="container mx-auto py-8 px-4">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold text-foreground mb-6">Preguntas Frecuentes</h1>
              
              <div className="grid grid-cols-1 gap-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <HelpCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default FAQ;