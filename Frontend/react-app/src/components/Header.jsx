import './Header.css';

function Header({ onNavigate }) {
  function handleNavigation(event, view, anchor) {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(view, anchor);
  }

  return (
    <header className="site-header">
      <a className="brand" href="?" onClick={(event) => handleNavigation(event, 'inicio')} aria-label="Fórmula Exacta, inicio">
        <img
          src={`${import.meta.env.BASE_URL}images/logo.jpg`}
          alt="Logo de Fórmula Exacta"
          className="brand-logo"
        />
        <span className="brand-name">
          Fórmula <strong>Exacta</strong>
        </span>
      </a>

      <nav className="main-nav" aria-label="Navegación principal">
        <a href="?" onClick={(event) => handleNavigation(event, 'inicio', 'inicio')}>Inicio</a>
        <a href="?" onClick={(event) => handleNavigation(event, 'inicio', 'cursos')}>Cursos</a>
        <a href="?" onClick={(event) => handleNavigation(event, 'inicio', 'nosotros')}>Nosotros</a>
        <a href="?" onClick={(event) => handleNavigation(event, 'inicio', 'precios')}>Precios</a>
        <a href="?" onClick={(event) => handleNavigation(event, 'inicio', 'contacto')}>Contacto</a>
      </nav>

      <div className="header-actions">
        <a className="header-button header-button-student" href="?pagina=student-login" onClick={(event) => handleNavigation(event, 'student-login')}>
          Acceso estudiantes
        </a>
        <a className="header-button header-button-staff" href="?pagina=staff-login" onClick={(event) => handleNavigation(event, 'staff-login')}>
          Docentes y admin
        </a>
      </div>
    </header>
  );
}

export default Header;
