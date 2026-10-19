function Home() {
  return (
    <main>
      <section className="hero" id="inicio">
        <div className="hero-content">
          <span className="hero-label">
            <span className="status-dot"></span>
            TU FUTURO COMIENZA AQUÍ
          </span>

          <h1>
            Las matemáticas
            <br />
            tienen su <span>fórmula.</span>
          </h1>

          <p className="hero-description">
            Descubre una nueva forma de aprender Matemáticas, Física y Cálculo.
            Clases especializadas, acompañamiento personalizado y recursos
            para avanzar a tu ritmo.
          </p>

          <div className="hero-actions">
            <a href="#cursos" className="button-primary">
              Descubrir cursos <span aria-hidden="true">↗</span>
            </a>

            <a href="#beneficios" className="button-secondary">
              Conoce nuestra academia
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <strong>24/7</strong>
              <span>Grabaciones disponibles</span>
            </div>

            <div>
              <strong>3 áreas</strong>
              <span>Matemáticas, Física y Cálculo</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Fórmulas matemáticas">
          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>

          <div className="formula-card formula-card-main">
            <span className="formula-tag">FÓRMULA DEL ÉXITO</span>
            <div className="formula-symbol">∑</div>
            <div className="formula-equation">
              <span>Conocimiento</span>
              <span className="formula-plus">+</span>
              <span>Constancia</span>
            </div>
            <div className="formula-line"></div>
            <p>Tu próximo gran logro</p>
          </div>

          <div className="floating-formula floating-formula-top">
            E = mc²
          </div>

          <div className="floating-formula floating-formula-bottom">
            f(x) = x² + 2x
          </div>

          <div className="visual-glow"></div>
        </div>
      </section>

      <section className="benefits-section" id="beneficios">
        <div className="section-heading">
          <span className="section-eyebrow">APRENDE CON PROPÓSITO</span>
          <h2>Más que clases, una nueva perspectiva.</h2>
          <p>
            Te acompañamos para que comprendas los conceptos y avances con
            confianza.
          </p>
        </div>

        <div className="benefits-grid">
          <article className="benefit-card">
            <span className="benefit-icon">⌘</span>
            <h3>Clases en vivo y grabadas</h3>
            <p>
              Participa en las clases y vuelve a revisar las explicaciones
              cuando lo necesites.
            </p>
          </article>

          <article className="benefit-card">
            <span className="benefit-icon">∑</span>
            <h3>Profesores especializados</h3>
            <p>
              Aprende con docentes comprometidos con tu progreso y con una
              enseñanza clara.
            </p>
          </article>

          <article className="benefit-card">
            <span className="benefit-icon">ƒ</span>
            <h3>Cálculo como nuestro PLUS</h3>
            <p>
              Explora el cálculo diferencial e integral con un programa
              pensado para jóvenes.
            </p>
          </article>

          <article className="benefit-card">
            <span className="benefit-icon">↗</span>
            <h3>Seguimiento personalizado</h3>
            <p>
              Refuerza tus conocimientos y descubre qué temas necesitas
              practicar más.
            </p>
          </article>
        </div>
      </section>

      <section className="courses-section" id="cursos">
        <div>
          <span className="section-eyebrow">ENCUENTRA TU CAMINO</span>
          <h2>El conocimiento abre posibilidades.</h2>
          <p>
            Matemáticas, Física y Cálculo: fortalece tus bases y prepárate
            para tus próximos desafíos académicos.
          </p>
        </div>

        <a href="#contacto" className="button-primary">
          Quiero más información <span aria-hidden="true">↗</span>
        </a>
      </section>

      <section className="contact-section" id="contacto">
        <span className="section-eyebrow">EMPECEMOS JUNTOS</span>
        <h2>Tu siguiente paso empieza hoy.</h2>
        <p>
          Conoce nuestros programas y encuentra una opción que se adapte a
          tus objetivos académicos.
        </p>
        <a href="mailto:info@formulaexacta.com" className="button-primary">
          Contáctanos <span aria-hidden="true">↗</span>
        </a>
      </section>
    </main>
  );
}

export default Home;
