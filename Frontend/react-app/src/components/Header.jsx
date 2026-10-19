import './Header.css';

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="Fórmula Exacta, inicio">
        <img
          src="/images/logo.jpg"
          alt="Logo de Fórmula Exacta"
          className="brand-logo"
        />
        <span className="brand-name">
          Fórmula <strong>Exacta</strong>
        </span>
      </a>

      <nav className="main-nav" aria-label="Navegación principal">
        <a href="#inicio">Inicio</a>
        <a href="#beneficios">Beneficios</a>
        <a href="#cursos">Cursos</a>
        <a href="#contacto">Contacto</a>
      </nav>

      <a className="header-button" href="#cursos">
        Explorar cursos <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}

export default Header;
