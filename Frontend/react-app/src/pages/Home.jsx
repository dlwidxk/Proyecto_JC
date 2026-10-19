import { useState } from 'react';

const API_URL = 'http://localhost:2323/api';

function Home() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    nivel: '',
    materias: [],
  });

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');

  function manejarCambio(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function manejarMaterias(event) {
    const { value, checked } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      materias: checked
        ? [...anterior.materias, value]
        : anterior.materias.filter((materia) => materia !== value),
    }));
  }

  async function manejarEnvio(event) {
    event.preventDefault();
    setMensaje('');
    setTipoMensaje('');

    if (formulario.materias.length === 0) {
      setMensaje('Selecciona al menos una materia.');
      setTipoMensaje('error');
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/alumnos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formulario),
      });

      const data = await respuesta.json();

      if (!respuesta.ok || !data.exito) {
        throw new Error(data.mensaje || 'No se pudo enviar la inscripción.');
      }

      setMensaje('¡Inscripción enviada correctamente!');
      setTipoMensaje('exito');

      setFormulario({
        nombre: '',
        email: '',
        nivel: '',
        materias: [],
      });
    } catch (error) {
      setMensaje(
        error.message || 'No se pudo conectar con el servidor.'
      );
      setTipoMensaje('error');
    } finally {
      setCargando(false);
    }
  }

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
        <span className="section-eyebrow">INSCRIPCIONES</span>
        <h2>Da el siguiente paso.</h2>
        <p>
          Completa tus datos y nos pondremos en contacto contigo.
        </p>

        <form
          onSubmit={manejarEnvio}
          style={{
            display: 'grid',
            gap: '16px',
            width: 'min(100%, 480px)',
            margin: '28px auto 0',
            textAlign: 'left',
          }}
        >
          <label>
            Nombre completo
            <input
              name="nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              autoComplete="name"
              required
              maxLength={100}
              placeholder="Escribe tu nombre"
              style={{
                display: 'block',
                width: '100%',
                marginTop: '8px',
                padding: '12px',
                borderRadius: '8px',
              }}
            />
          </label>

          <label>
            Correo electrónico
            <input
              type="email"
              name="email"
              value={formulario.email}
              onChange={manejarCambio}
              autoComplete="email"
              required
              maxLength={150}
              placeholder="tucorreo@ejemplo.com"
              style={{
                display: 'block',
                width: '100%',
                marginTop: '8px',
                padding: '12px',
                borderRadius: '8px',
              }}
            />
          </label>

          <label>
            Nivel académico
            <select
              name="nivel"
              value={formulario.nivel}
              onChange={manejarCambio}
              required
              style={{
                display: 'block',
                width: '100%',
                marginTop: '8px',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <option value="">Selecciona el  nivel de interés</option>
              <option value="12-14">12 a 14 años</option>
              <option value="15-17">15 a 17 años</option>
            </select>
          </label>

          {mensaje && (
            <p
              role="status"
              style={{
                color: tipoMensaje === 'error' ? '#ff7777' : '#75d9a0',
              }}
            >
              {mensaje}
            </p>
          )}

          <button
            type="submit"
            className="button-primary"
            disabled={cargando}
          >
            {cargando ? 'Enviando inscripción...' : 'Enviar inscripción'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Home;
