import { useState } from 'react';
import { apiUrl } from '../services/api';
import AcademySections from './AcademySections';

function Home() {
  /* Aquí guardamos los datos de la inscripción */
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    nivel: '',
    password: '',
    confirmarPassword: '',
  });

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');

  /* Aquí guardamos los datos del formulario de contacto */
  const [contacto, setContacto] = useState({
    nombre: '',
    email: '',
    telefono: '',
    nivel: '',
    mensaje: '',
  });

  const [enviandoContacto, setEnviandoContacto] = useState(false);
  const [resultadoContacto, setResultadoContacto] = useState('');
  const [errorContacto, setErrorContacto] = useState(false);

  /* Aquí actualizamos los campos de inscripción */
  function manejarCambio(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  /* Aquí enviamos la inscripción al backend */
  async function manejarEnvio(event) {
    event.preventDefault();
    setMensaje('');
    setTipoMensaje('');

    if (formulario.password !== formulario.confirmarPassword) {
      setMensaje('Las contraseñas no coinciden.');
      setTipoMensaje('error');
      return;
    }

    setCargando(true);

    try {
      const datosInscripcion = {
        nombre: formulario.nombre,
        email: formulario.email,
        nivel: formulario.nivel,
        password: formulario.password,
      };
      const respuesta = await fetch(apiUrl('/alumnos'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosInscripcion),
      });

      const data = await respuesta.json();

      if (!respuesta.ok || !data.exito) {
        throw new Error(data.mensaje || 'No se pudo enviar la inscripción.');
      }

      setMensaje('Cuenta creada e inscripción recibida. Ya puedes iniciar sesión en el portal de estudiantes.');
      setTipoMensaje('exito');

      setFormulario({
        nombre: '',
        email: '',
        nivel: '',
        password: '',
        confirmarPassword: '',
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

  /* Aquí actualizamos los campos de contacto */
  function manejarCambioContacto(event) {
    const { name, value } = event.target;

    setContacto((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  /* Aquí enviamos las consultas al backend */
  async function enviarContacto(event) {
    event.preventDefault();
    setResultadoContacto('');
    setErrorContacto(false);
    setEnviandoContacto(true);

    try {
      const respuesta = await fetch(apiUrl('/contacto'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contacto),
      });

      const data = await respuesta.json();

      if (!respuesta.ok || !data.exito) {
        throw new Error(data.mensaje || 'No se pudo enviar tu consulta.');
      }

      setResultadoContacto(
        '¡Tu mensaje se envió correctamente! Nos pondremos en contacto contigo.'
      );

      setContacto({
        nombre: '',
        email: '',
        telefono: '',
        nivel: '',
        mensaje: '',
      });
    } catch (error) {
      setErrorContacto(true);
      setResultadoContacto(
        error.message || 'No se pudo conectar con el servidor.'
      );
    } finally {
      setEnviandoContacto(false);
    }
  }

  return (
    <main>
      {/* Aquí mantenemos la portada original */}
      <section className="hero" id="inicio" aria-labelledby="titulo-inicio">
        <div className="hero-content">
          <span className="hero-label">
            <span className="status-dot"></span>
            TU FUTURO COMIENZA AQUÍ
          </span>

          <h1 id="titulo-inicio">
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

      {/* Aquí mostramos los beneficios de la academia */}
      <section
        className="benefits-section"
        id="beneficios"
        aria-labelledby="titulo-beneficios"
      >
        <header className="section-heading">
          <span className="section-eyebrow">APRENDE CON PROPÓSITO</span>
          <h2 id="titulo-beneficios">
            Más que clases, una nueva perspectiva.
          </h2>
          <p>
            Te acompañamos para que comprendas los conceptos y avances con
            confianza.
          </p>
        </header>

        <div className="benefits-grid">
          <article className="benefit-card">
            <span className="benefit-icon" aria-hidden="true">⌘</span>
            <h3>Clases en vivo y grabadas</h3>
            <p>
              Participa en las clases y vuelve a revisar las explicaciones
              cuando lo necesites.
            </p>
          </article>

          <article className="benefit-card">
            <span className="benefit-icon" aria-hidden="true">∑</span>
            <h3>Profesores especializados</h3>
            <p>
              Aprende con docentes comprometidos con tu progreso y con una
              enseñanza clara.
            </p>
          </article>

          <article className="benefit-card">
            <span className="benefit-icon" aria-hidden="true">ƒ</span>
            <h3>Cálculo como nuestro PLUS</h3>
            <p>
              Explora el cálculo diferencial e integral con un programa
              pensado para jóvenes.
            </p>
          </article>

          <article className="benefit-card">
            <span className="benefit-icon" aria-hidden="true">↗</span>
            <h3>Seguimiento personalizado</h3>
            <p>
              Refuerza tus conocimientos y descubre qué temas necesitas
              practicar más.
            </p>
          </article>
        </div>
      </section>

      <AcademySections />

      {/* Aquí presentamos los cursos y sus beneficios */}
      <section
        className="courses-section"
        id="destacados"
        aria-labelledby="titulo-cursos"
      >
        <div>
          <span className="section-eyebrow">ENCUENTRA TU CAMINO</span>
          <h2 id="titulo-cursos">El conocimiento abre posibilidades.</h2>
          <p>
            Matemáticas, Física y Cálculo: fortalece tus bases y prepárate
            para tus próximos desafíos académicos.
          </p>
        </div>

        <a href="#inscripciones" className="button-primary">
          Quiero inscribirme <span aria-hidden="true">↗</span>
        </a>
      </section>

      {/* Aquí va el formulario de inscripción */}
      <section
        className="contact-section"
        id="inscripciones"
        aria-labelledby="titulo-inscripciones"
      >
        <span className="section-eyebrow">INSCRIPCIONES</span>
        <h2 id="titulo-inscripciones">Crea tu cuenta y solicita tu cupo.</h2>
        <p>
          Inscríbete, crea una contraseña y accede al portal de estudiantes.
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
            Crea una contraseña
            <input
              type="password"
              name="password"
              value={formulario.password}
              onChange={manejarCambio}
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              placeholder="Al menos 8 caracteres"
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
            Confirma tu contraseña
            <input
              type="password"
              name="confirmarPassword"
              value={formulario.confirmarPassword}
              onChange={manejarCambio}
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              placeholder="Escribe la contraseña otra vez"
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
            Selecciona el nivel de tu interés:
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
              <option value="">Selecciona el nivel de tu interés</option>
              <option value="12-14">De 12 a 14 años</option>
              <option value="15-17">De 15 a 17 años</option>
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
            {cargando ? 'Creando cuenta...' : 'Crear cuenta e inscribirme'}
          </button>
        </form>
      </section>

      {/* Aquí va el formulario de contacto */}
      <section
        className="contact-section"
        id="contacto"
        aria-labelledby="titulo-contacto"
      >
        <span className="section-eyebrow">ESTAMOS PARA AYUDARTE</span>
        <h2 id="titulo-contacto">¿Tienes alguna consulta?</h2>
        <p>
          Escríbenos y te ayudaremos a encontrar la mejor opción para ti.
        </p>

        <form
          onSubmit={enviarContacto}
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
              value={contacto.nombre}
              onChange={manejarCambioContacto}
              autoComplete="name"
              maxLength={100}
              required
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
              value={contacto.email}
              onChange={manejarCambioContacto}
              autoComplete="email"
              maxLength={150}
              required
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
            Teléfono (opcional)
            <input
              type="tel"
              name="telefono"
              value={contacto.telefono}
              onChange={manejarCambioContacto}
              autoComplete="tel"
              maxLength={30}
              placeholder="+593 96 000 0000"
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
            Selecciona el nivel de tu interés:
            <select
              name="nivel"
              value={contacto.nivel}
              onChange={manejarCambioContacto}
              required
              style={{
                display: 'block',
                width: '100%',
                marginTop: '8px',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <option value="">Selecciona el nivel de tu interés</option>
              <option value="12-14">De 12 a 14 años</option>
              <option value="15-17">De 15 a 17 años</option>
            </select>
          </label>

          <label>
            Tu mensaje
            <textarea
              name="mensaje"
              value={contacto.mensaje}
              onChange={manejarCambioContacto}
              required
              minLength={5}
              maxLength={3000}
              rows={5}
              placeholder="Cuéntanos en qué podemos ayudarte..."
              style={{
                display: 'block',
                width: '100%',
                marginTop: '8px',
                padding: '12px',
                borderRadius: '8px',
                resize: 'vertical',
              }}
            />
          </label>

          {resultadoContacto && (
            <p
              role="status"
              style={{
                color: errorContacto ? '#ff7777' : '#75d9a0',
              }}
            >
              {resultadoContacto}
            </p>
          )}

          <button
            type="submit"
            className="button-primary"
            disabled={enviandoContacto}
          >
            {enviandoContacto ? 'Enviando mensaje...' : 'Enviar mensaje'}
          </button>
        </form>

        <div className="contact-info">
          <h3>También puedes escribirnos</h3>
          <a href="mailto:info@formulaexacta.com">info@formulaexacta.com</a>
          <a href="https://wa.me/593960203174" target="_blank" rel="noreferrer">
            WhatsApp: +593 96 020 3174
          </a>
          <p>Instagram, Facebook y TikTok: @formulaexacta</p>
        </div>
      </section>
    </main>
  );
}

export default Home;
