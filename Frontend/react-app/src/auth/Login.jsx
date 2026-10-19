
import { useState } from 'react';

const API_URL = 'http://localhost:2323/api';

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarLogin(event) {
    event.preventDefault();
    setError('');

    if (!usuario.trim() || !password) {
      setError('Completa el usuario y la contraseña.');
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: usuario.trim(),
          password,
        }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok || !data.exito || !data.token) {
        throw new Error(data.mensaje || 'No se pudo iniciar sesión.');
      }

      onLogin({
        nombre: data.nombre,
        token: data.token,
      });
    } catch (err) {
      setError(
        err.message || 'No se pudo conectar con el servidor.'
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="contact-section">
      <span className="section-eyebrow">ÁREA ADMINISTRATIVA</span>
      <h2>Iniciar sesión</h2>
      <p>Accede con tus credenciales de administrador.</p>

      <form
        onSubmit={manejarLogin}
        style={{
          display: 'grid',
          gap: '16px',
          width: 'min(100%, 380px)',
          marginTop: '20px',
        }}
      >
        <label>
          Usuario
          <input
            value={usuario}
            onChange={(event) => setUsuario(event.target.value)}
            autoComplete="username"
            required
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
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            style={{
              display: 'block',
              width: '100%',
              marginTop: '8px',
              padding: '12px',
              borderRadius: '8px',
            }}
          />
        </label>

        {error && (
          <p role="alert" style={{ color: '#ff7777' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          className="button-primary"
          disabled={cargando}
        >
          {cargando ? 'Verificando...' : 'Entrar'}
        </button>
      </form>
    </section>
  );
}

export default Login;
