
import { useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './auth/Login';
import { obtenerAlumnos } from './services/alumnosService';
import { marcarContactoLeido, obtenerContactos } from './services/contactosService';
import './App.css';
import './pages/Home.css';
import Chatbot from './components/Chatbot';

function App() {
  const [sesion, setSesion] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [cargandoAlumnos, setCargandoAlumnos] = useState(false);
  const [errorAlumnos, setErrorAlumnos] = useState('');
  const [mostrarLogin, setMostrarLogin] = useState(false);

  async function consultarDatosAdmin(token) {
    setCargandoAlumnos(true);
    setErrorAlumnos('');

    try {
      const [resultadoAlumnos, resultadoContactos] = await Promise.all([
        obtenerAlumnos(token),
        obtenerContactos(token),
      ]);
      setAlumnos(resultadoAlumnos);
      setContactos(resultadoContactos);
    } catch (error) {
      setErrorAlumnos(error.message);
    } finally {
      setCargandoAlumnos(false);
    }
  }

  async function marcarMensajeLeido(contactoId) {
    try {
      const actualizado = await marcarContactoLeido(contactoId, sesion.token);
      setContactos((anteriores) => anteriores.map((contacto) => (
        contacto._id === actualizado._id ? actualizado : contacto
      )));
    } catch (error) {
      setErrorAlumnos(error.message);
    }
  }

  function iniciarSesion(datos) {
    setSesion(datos);
    setMostrarLogin(false);
    consultarDatosAdmin(datos.token);
  }

  function cerrarSesion() {
    setSesion(null);
    setAlumnos([]);
    setContactos([]);
    setErrorAlumnos('');
    setMostrarLogin(false);
  }

  return (
    <>
      <Header />

      <Home />

      <section
        className="contact-section"
        id="area-administrativa"
      >
        {!sesion && !mostrarLogin && (
          <>
            <span className="section-eyebrow">
              ACCESO RESTRINGIDO
            </span>
            <h2>Área administrativa</h2>
            <p>
              Inicia sesión para revisar alumnos y mensajes de contacto.
            </p>
            <button
              className="button-primary"
              onClick={() => setMostrarLogin(true)}
            >
              Iniciar sesión
            </button>
          </>
        )}

        {mostrarLogin && !sesion && (
          <Login onLogin={iniciarSesion} />
        )}

        {sesion && (
          <div className="admin-dashboard">
            <span className="section-eyebrow">PANEL ADMINISTRATIVO</span>
            <h2>Bienvenida, {sesion.nombre}</h2>
            <button className="button-secondary" onClick={cerrarSesion}>Cerrar sesión</button>

            <div className="admin-stats">
              <article><strong>{alumnos.length}</strong><span>Alumnos registrados</span></article>
              <article><strong>{contactos.length}</strong><span>Mensajes recibidos</span></article>
              <article><strong>{contactos.filter((contacto) => !contacto.leido).length}</strong><span>Mensajes sin leer</span></article>
            </div>

            {errorAlumnos && <p role="alert" className="admin-error">{errorAlumnos}</p>}

            <div className="admin-table-section">
              <div className="admin-section-heading">
                <h3>Alumnos registrados</h3>
                <button className="button-primary" onClick={() => consultarDatosAdmin(sesion.token)} disabled={cargandoAlumnos}>
                  {cargandoAlumnos ? 'Actualizando...' : 'Actualizar información'}
                </button>
              </div>
              {cargandoAlumnos ? <p role="status">Cargando información...</p> : (
                <div className="admin-table-wrap">
                  <table>
                    <thead><tr><th>Nombre</th><th>Correo</th><th>Nivel</th><th>Materias</th><th>Estado</th></tr></thead>
                    <tbody>
                      {alumnos.map((alumno) => (
                        <tr key={alumno._id}>
                          <td>{alumno.nombre}</td><td>{alumno.email}</td><td>{alumno.nivel}</td>
                          <td>{Array.isArray(alumno.materias) && alumno.materias.length ? alumno.materias.join(', ') : 'Sin asignar'}</td>
                          <td>{alumno.estado || 'Sin estado'}</td>
                        </tr>
                      ))}
                      {alumnos.length === 0 && <tr><td colSpan="5">No hay alumnos registrados.</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="admin-table-section">
              <h3>Mensajes de contacto</h3>
              {!cargandoAlumnos && (
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

      <footer className="site-footer">
        <a href="#inicio" className="footer-brand">
          Fórmula <strong>Exacta</strong>
        </a>
        <p>
          © {new Date().getFullYear()} Fórmula Exacta.
          Todos los derechos reservados.
        </p>
      </footer>
      <Chatbot />
    </>
  );
}

export default App;
