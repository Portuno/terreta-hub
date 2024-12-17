export const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Sobre Nosotros
            </h3>
            <p className="mt-4 text-base text-gray-500">
              Construyendo una comunidad de emprendedores tecnológicos en Valencia.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Enlaces Útiles
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="/faq" className="text-base text-gray-500 hover:text-gray-900">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/recursos" className="text-base text-gray-500 hover:text-gray-900">
                  Recursos
                </a>
              </li>
              <li>
                <a href="/eventos" className="text-base text-gray-500 hover:text-gray-900">
                  Eventos
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Contacto
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="text-base text-gray-500">
                Valencia, España
              </li>
              <li>
                <a href="mailto:info@techhub.com" className="text-base text-gray-500 hover:text-gray-900">
                  info@techhub.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} TechHub Valencia. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};