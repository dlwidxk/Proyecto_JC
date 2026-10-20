import { useEffect, useState } from 'react';
import { apiUrl } from '../services/api';
import { recursosAlumnoPorNivel } from './studentResources';
import './StudentAccess.css';

const programasPorNivel = {
  '12-14': {
    nombre: 'Exploradores de Matemáticas y Física',
    materias: 'Matemáticas y Física',
  },
  '15-17': {
    nombre: 'Dominando las Ciencias Exactas',
    materias: 'Matemáticas, Física y Cálculo',
  },
};

function StudentAccess({ sesion, onLogin, onLogout, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [materiaActiva, setMateriaActiva] = useState('matematicas');

  async function iniciarSesion(event) {
    event.preventDefault();
    setError('');
    setCargando(true);

    try {
      const respuesta = await fetch(apiUrl('/alumnos/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const datos = await respuesta.json();

      if (!respuesta.ok || !datos.exito || !datos.token || !datos.alumno) {
        throw new Error(datos.mensaje || 'No se pudo iniciar sesión.');
      }

      onLogin({ token: datos.token, alumno: datos.alumno });
      setPassword('');
    } catch (loginError) {
      setError(loginError.message || 'No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  }

  const programa = sesion ? programasPorNivel[sesion.alumno.nivel] : null;
  const recursos = sesion ? recursosAlumnoPorNivel[sesion.alumno.nivel] : null;
  const materiaSeleccionada = recursos?.materias.find((materia) => materia.id === materiaActiva)
    || recursos?.materias[0];

  useEffect(() => {
    setMateriaActiva('matematicas');
  }, [sesion?.alumno.nivel]);

  return (
    <section className="student-access-section" id="acceso-estudiantes" aria-labelledby="student-access-title">
      {!sesion ? (
        <div className="student-login-card">
          <span className="section-eyebrow">PORTAL DE ESTUDIANTES</span>
          <h2 id="student-access-title">Qué bueno tenerte de vuelta.</h2>
          <p>Ingresa con el correo y la contraseña que creaste al inscribirte.</p>

          <form className="student-login-form" onSubmit={iniciarSesion}>
            <label>
              Correo electrónico
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
                maxLength={150}
                placeholder="tucorreo@ejemplo.com"
              />
            </label>
            <label>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                maxLength={128}
                placeholder="Tu contraseña"
              />
            </label>
            {error && <p className="student-login-error" role="alert">{error}</p>}
            <button className="button-primary" type="submit" disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="student-login-help">
            ¿Aún no tienes cuenta? <a href="?" onClick={(event) => { event.preventDefault(); onNavigate('inicio', 'contacto'); }}>Contacta a la academia para gestionar tu inscripción y acceso.</a>
          </p>
          <p className="student-login-help">
            ¿Ya estabas inscrito y no tienes contraseña? <a href="?" onClick={(event) => { event.preventDefault(); onNavigate('inicio', 'contacto'); }}>Escríbenos para activar tu acceso.</a>
          </p>
        </div>
      ) : (
        <div className="student-dashboard-card">
          <div className="student-dashboard-heading">
            <div>
              <span className="section-eyebrow">MI ESPACIO</span>
              <h2 id="student-access-title">Hola, {sesion.alumno.nombre}.</h2>
              <p>Este es tu espacio para repasar los temas de tu grupo.</p>
            </div>
            <button className="button-secondary" onClick={onLogout}>Cerrar sesión</button>
          </div>

          <div className="student-program-card">
            <span>Tu nivel · {sesion.alumno.nivel} años</span>
            <h3>{programa?.nombre || 'Programa de ciencias exactas'}</h3>
            <p>Materias de tu grupo: {programa?.materias || 'Consulta tus materias con la academia'}.</p>
            <p>Estado de la cuenta: {sesion.alumno.estado || 'Activo'}.</p>
          </div>

          {recursos && materiaSeleccionada && (
            <>
              <aside className="student-schedule" aria-label="Horario del grupo">
                <span>HORARIO DE TU GRUPO · HORA DE ECUADOR</span>
                <strong>{recursos.horario}</strong>
                <small>Horario de referencia para este proyecto.</small>
              </aside>

              {/* Cada botón abre la sección de la materia que el estudiante quiere repasar. */}
              <nav className="student-subject-nav" aria-label="Materias de tu grupo">
                {recursos.materias.map((materia) => (
                  <button
                    key={materia.id}
                    type="button"
                    aria-pressed={materiaActiva === materia.id}
                    onClick={() => setMateriaActiva(materia.id)}
                  >
                    {materia.nombre}
                  </button>
                ))}
              </nav>

              <article className="student-resource-panel" aria-live="polite">
                <span className="section-eyebrow">RECURSO DE {materiaSeleccionada.nombre.toUpperCase()}</span>
                <h3>{materiaSeleccionada.titulo}</h3>
                <p>{materiaSeleccionada.descripcion}</p>
                <div className="student-practice-prompt">
                  <strong>Pruébalo por tu cuenta</strong>
                  <p>{materiaSeleccionada.practica}</p>
                </div>
                {/* Así el estudiante puede empezar a ver el recurso sin salir de su espacio. */}
                <div className="student-video-block">
                  <h4>Video de apoyo: {materiaSeleccionada.video}</h4>
                  <div className="student-video-frame-wrap">
                    <iframe
                      title={materiaSeleccionada.video}
                      src={`https://www.youtube-nocookie.com/embed/${materiaSeleccionada.videoId}`}
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <a className="student-video-link" href={materiaSeleccionada.url} target="_blank" rel="noreferrer">
                    Si el video no carga, ábrelo en Khan Academy
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
                <small className="student-resource-credit">Video de {materiaSeleccionada.videoFuente}.</small>
              </article>
            </>
          )}

          {!recursos && <p className="student-login-error">No encontramos recursos para tu nivel. Contacta a la academia para que revise tu cuenta.</p>}
        </div>
      )}
    </section>
  );
}

export default StudentAccess;
