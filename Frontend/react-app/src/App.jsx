import { useEffect, useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './auth/Login';
import StudentAccess from './auth/StudentAccess';
import AdminEnrollmentForm from './auth/AdminEnrollmentForm';
import { asignarContrasenaAlumno, obtenerAlumnos } from './services/alumnosService';
import { marcarContactoLeido, obtenerContactos } from './services/contactosService';
import './App.css';
import './pages/Home.css';
import Chatbot from './components/Chatbot';

const paginas = new Set(['inicio', 'student-login', 'student-dashboard', 'staff-login', 'staff-dashboard']);

function leerPagina() {
  const solicitada = new URLSearchParams(window.location.search).get('pagina') || 'inicio';
  return paginas.has(solicitada) ? solicitada : 'inicio';
}

function App() {
  const [pagina, setPagina] = useState(leerPagina);
  const [sesion, setSesion] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [credenciales, setCredenciales] = useState({});
  const [mensajeCredenciales, setMensajeCredenciales] = useState('');
  const [sesionEstudiante, setSesionEstudiante] = useState(null);

  useEffect(() => {
    const sincronizarPagina = () => setPagina(leerPagina());
    window.addEventListener('popstate', sincronizarPagina);
    return () => window.removeEventListener('popstate', sincronizarPagina);
  }, []);

  function navegar(destino, ancla) {
    const url = new URL(window.location.href);
    if (destino === 'inicio') url.searchParams.delete('pagina');
    else url.searchParams.set('pagina', destino);
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
    setPagina(destino);
    window.setTimeout(() => {
      if (ancla) document.getElementById(ancla)?.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }

  async function consultarDatosAdmin(token) {
    setCargando(true);
    setError('');
    try {
      const [resultadoAlumnos, resultadoContactos] = await Promise.all([
        obtenerAlumnos(token), obtenerContactos(token),
      ]);
      setAlumnos(resultadoAlumnos);
      setContactos(resultadoContactos);
    } catch (consultaError) {
      setError(consultaError.message);
    } finally {
      setCargando(false);
    }
  }

  async function marcarMensajeLeido(contactoId) {
    try {
      const actualizado = await marcarContactoLeido(contactoId, sesion.token);
      setContactos((anteriores) => anteriores.map((contacto) => (
        contacto._id === actualizado._id ? actualizado : contacto
      )));
    } catch (consultaError) {
      setError(consultaError.message);
    }
  }

  async function guardarContrasena(alumnoId) {
    const password = credenciales[alumnoId] || '';
    setMensajeCredenciales('');
    try {
      await asignarContrasenaAlumno(alumnoId, password, sesion.token);
      setCredenciales((anteriores) => ({ ...anteriores, [alumnoId]: '' }));
      setMensajeCredenciales('Contraseña actualizada. El estudiante ya puede iniciar sesión.');
    } catch (saveError) {
      setMensajeCredenciales(saveError.message);
    }
  }

  function iniciarSesionAdmin(datos) {
    setSesion(datos);
    navegar('staff-dashboard');
    consultarDatosAdmin(datos.token);
  }

  function cerrarSesionAdmin() {
    setSesion(null);
    setAlumnos([]);
    setContactos([]);
    setError('');
    navegar('inicio');
  }

  function iniciarSesionEstudiante(datos) {
    setSesionEstudiante(datos);
    navegar('student-dashboard');
  }

  function cerrarSesionEstudiante() {
    setSesionEstudiante(null);
    navegar('inicio');
  }

  const mostrarHome = pagina === 'inicio';
  const mostrarPortalEstudiante = pagina === 'student-login' || pagina === 'student-dashboard';
  const mostrarPortalPersonal = pagina === 'staff-login' || pagina === 'staff-dashboard';

  return (
    <>
      <Header onNavigate={navegar} />

      {mostrarHome && <Home />}

      {mostrarPortalEstudiante && (
        <StudentAccess
          sesion={pagina === 'student-dashboard' ? sesionEstudiante : null}
          onLogin={iniciarSesionEstudiante}
          onLogout={cerrarSesionEstudiante}
          onNavigate={navegar}
        />
      )}

      {mostrarPortalPersonal && (
        <section className="contact-section" id="area-administrativa">
          {!sesion ? (
            <Login onLogin={iniciarSesionAdmin} />
          ) : (
            <div className="admin-dashboard">
              <span className="section-eyebrow">PANEL DE DOCENTES Y ADMINISTRACIÓN</span>
              <h2>Bienvenida, {sesion.nombre}</h2>
              <button className="button-secondary" onClick={cerrarSesionAdmin}>Cerrar sesión</button>

              <div className="admin-stats">
                <article><strong>{alumnos.length}</strong><span>Alumnos registrados</span></article>
                <article><strong>{contactos.length}</strong><span>Mensajes recibidos</span></article>
                <article><strong>{contactos.filter((contacto) => !contacto.leido).length}</strong><span>Mensajes sin leer</span></article>
              </div>

              {/* Desde aquí la administradora crea el registro y el acceso del estudiante. */}
              <AdminEnrollmentForm token={sesion.token} onCreated={() => consultarDatosAdmin(sesion.token)} />

              {error && <p role="alert" className="admin-error">{error}</p>}

              <div className="admin-table-section">
                <div className="admin-section-heading">
                  <h3>Alumnos registrados</h3>
                  <button className="button-primary" onClick={() => consultarDatosAdmin(sesion.token)} disabled={cargando}>
                    {cargando ? 'Actualizando...' : 'Actualizar información'}
                  </button>
                </div>
                {mensajeCredenciales && <p className="admin-credential-message" role="status">{mensajeCredenciales}</p>}
                {cargando ? <p role="status">Cargando información...</p> : (
                  <div className="admin-table-wrap">
                    <table>
                      <thead><tr><th>Nombre</th><th>Correo</th><th>Nivel</th><th>Materias</th><th>Estado</th><th>Acceso</th></tr></thead>
                      <tbody>
                        {alumnos.map((alumno) => (
                          <tr key={alumno._id}>
                            <td>{alumno.nombre}</td><td>{alumno.email}</td><td>{alumno.nivel}</td>
                            <td>{Array.isArray(alumno.materias) && alumno.materias.length ? alumno.materias.join(', ') : 'Sin asignar'}</td>
                            <td>{alumno.estado || 'Sin estado'}</td>
                            <td>
                              <div className="admin-password-control">
                                <input type="password" minLength={8} maxLength={128} autoComplete="new-password" placeholder="Nueva contraseña" aria-label={`Nueva contraseña para ${alumno.nombre}`} value={credenciales[alumno._id] || ''} onChange={(event) => setCredenciales((anteriores) => ({ ...anteriores, [alumno._id]: event.target.value }))} />
                                <button type="button" disabled={(credenciales[alumno._id] || '').length < 8} onClick={() => guardarContrasena(alumno._id)}>Guardar</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {alumnos.length === 0 && <tr><td colSpan="6">No hay alumnos registrados.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="admin-credential-message">Este control también permite activar el acceso de estudiantes inscritos antes de crear cuentas.</p>
              </div>

              <div className="admin-table-section">
                <h3>Mensajes de contacto</h3>
                {!cargando && (
                  <div className="admin-table-wrap">
                    <table>
                      <thead><tr><th>Nombre</th><th>Correo</th><th>Nivel</th><th>Mensaje</th><th>Fecha</th><th>Estado</th></tr></thead>
                      <tbody>
                        {contactos.map((contacto) => (
                          <tr key={contacto._id}>
                            <td>{contacto.nombre}</td><td>{contacto.email}</td><td>{contacto.nivel}</td>
                            <td>{contacto.mensaje}</td><td>{new Date(contacto.fechaEnvio).toLocaleDateString('es-EC')}</td>
                            <td>{contacto.leido ? 'Leído' : <button className="admin-read-button" onClick={() => marcarMensajeLeido(contacto._id)}>Marcar leído</button>}</td>
                          </tr>
                        ))}
                        {contactos.length === 0 && <tr><td colSpan="6">No hay mensajes recibidos.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      <footer className="site-footer">
        <a href="?" className="footer-brand" onClick={(event) => { event.preventDefault(); navegar('inicio', 'inicio'); }}>Fórmula <strong>Exacta</strong></a>
        <p>© {new Date().getFullYear()} Fórmula Exacta. Todos los derechos reservados.</p>
      </footer>
      {mostrarHome && <Chatbot />}
    </>
  );
}

export default App;
