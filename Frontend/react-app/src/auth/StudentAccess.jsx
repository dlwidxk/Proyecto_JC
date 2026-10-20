import { useState } from 'react';
import { apiUrl } from '../services/api';
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
            ¿Aún no tienes cuenta? <a href="?" onClick={(event) => { event.preventDefault(); onNavigate('inicio', 'inscripciones'); }}>Crea tu cuenta al inscribirte.</a>
          </p>
          <p className="student-login-help">
            ¿Ya estabas inscrito y no tienes contraseña? <a href="?" onClick={(event) => { event.preventDefault(); onNavigate('inicio', 'contacto'); }}>Escríbenos para activar tu acceso.</a>
          </p>
        </div>
      ) : (
        <div className="student-dashboard-card">
          <span className="section-eyebrow">MI ESPACIO</span>
          <h2 id="student-access-title">Hola, {sesion.alumno.nombre}.</h2>
          <p>Tu cuenta está lista para que continúes avanzando.</p>
          <div className="student-program-card">
            <span>Tu nivel · {sesion.alumno.nivel} años</span>
            <h3>{programa?.nombre || 'Programa de ciencias exactas'}</h3>
            <p>Áreas de estudio: {programa?.materias || 'Consulta tus materias con la academia'}.</p>
            <p>Estado de la cuenta: {sesion.alumno.estado || 'Activo'}.</p>
          </div>
          <a className="student-course-link" href="?" onClick={(event) => { event.preventDefault(); onNavigate('inicio', 'cursos'); }}>Ver el contenido de tus cursos <span aria-hidden="true">↗</span></a>
          <button className="button-secondary student-logout" onClick={onLogout}>Cerrar sesión</button>
        </div>
      )}
    </section>
  );
}

export default StudentAccess;
