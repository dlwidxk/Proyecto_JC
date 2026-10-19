
import { useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './auth/Login';
import { obtenerAlumnos } from './services/alumnosService';
import './App.css';
import './pages/Home.css';

function App() {
  const [sesion, setSesion] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [cargandoAlumnos, setCargandoAlumnos] = useState(false);
  const [errorAlumnos, setErrorAlumnos] = useState('');
  const [mostrarLogin, setMostrarLogin] = useState(false);

  async function consultarAlumnos(token) {
    setCargandoAlumnos(true);
    setErrorAlumnos('');

    try {
      const resultado = await obtenerAlumnos(token);
      setAlumnos(resultado);
    } catch (error) {
      setErrorAlumnos(error.message);
    } finally {
      setCargandoAlumnos(false);
    }
  }

  function iniciarSesion(datos) {
    setSesion(datos);
    setMostrarLogin(false);
    consultarAlumnos(datos.token);
  }

  function cerrarSesion() {
    setSesion(null);
    setAlumnos([]);
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
              Inicia sesión para consultar la información
              de los alumnos.
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
          <div style={{ width: '100%', maxWidth: '900px' }}>
            <span className="section-eyebrow">
              PANEL ADMINISTRATIVO
            </span>
            <h2>Bienvenida, {sesion.nombre}</h2>

            <button
              className="button-secondary"
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </button>

            <h3 style={{ marginTop: '35px' }}>
              Alumnos registrados
            </h3>

            <button
              className="button-primary"
              onClick={() => consultarAlumnos(sesion.token)}
              disabled={cargandoAlumnos}
            >
              {cargandoAlumnos ? 'Cargando...' : 'Actualizar alumnos'}
            </button>

            {errorAlumnos && (
              <p role="alert">{errorAlumnos}</p>
            )}

            {cargandoAlumnos ? (
              <p>Cargando alumnos...</p>
            ) : (
              <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                <table style={{ width: '100%', textAlign: 'left' }}>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Nivel</th>
                      <th>Materias</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumnos.map((alumno) => (
                      <tr key={alumno._id}>
                        <td>{alumno.nombre}</td>
                        <td>{alumno.nivel}</td>
                        <td>
                          {Array.isArray(alumno.materias)
                            ? alumno.materias.join(', ')
                            : 'Sin asignar'}
                        </td>
                        <td>{alumno.estado || 'Sin estado'}</td>
                      </tr>
                    ))}

                    {!errorAlumnos && alumnos.length === 0 && (
                      <tr>
                        <td colSpan="4">
                          No hay alumnos registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
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
    </>
  );
}

export default App;
