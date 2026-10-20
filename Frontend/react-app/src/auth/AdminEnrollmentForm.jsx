import { useState } from 'react';
import { crearAlumnoDesdePanel } from '../services/alumnosService';
import './AdminEnrollmentForm.css';

function AdminEnrollmentForm({ token, onCreated }) {
  const [formulario, setFormulario] = useState({ nombre: '', email: '', nivel: '', password: '', confirmarPassword: '' });
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);

  function actualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((anterior) => ({ ...anterior, [name]: value }));
  }

  // Antes de guardar, comprobamos que el estudiante recibirá una contraseña que sí pueda usar.
  async function inscribirAlumno(event) {
    event.preventDefault();
    setMensaje('');
    setEsError(false);

    if (formulario.password !== formulario.confirmarPassword) {
      setMensaje('Las contraseñas no coinciden. Revísalas e inténtalo otra vez.');
      setEsError(true);
      return;
    }

    setCargando(true);
    try {
      await crearAlumnoDesdePanel({
        nombre: formulario.nombre,
        email: formulario.email,
        nivel: formulario.nivel,
        password: formulario.password,
      }, token);
      setFormulario({ nombre: '', email: '', nivel: '', password: '', confirmarPassword: '' });
      setMensaje('Alumno inscrito. Comparte su contraseña inicial de forma privada.');
      await onCreated();
    } catch (error) {
      setMensaje(error.message || 'No se pudo completar la inscripción.');
      setEsError(true);
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="admin-enrollment" aria-labelledby="admin-enrollment-title">
      <span className="section-eyebrow">GESTIÓN DE ALUMNOS</span>
      <h3 id="admin-enrollment-title">Inscribir nuevo alumno</h3>
      <p>Registra al estudiante desde tu panel y crea su acceso al portal.</p>

      <form className="admin-enrollment-form" onSubmit={inscribirAlumno}>
        <label>
          Nombre completo
          <input name="nombre" value={formulario.nombre} onChange={actualizarCampo} autoComplete="name" maxLength={100} required placeholder="Nombre del estudiante" />
        </label>
        <label>
          Correo electrónico
          <input type="email" name="email" value={formulario.email} onChange={actualizarCampo} autoComplete="email" maxLength={150} required placeholder="estudiante@ejemplo.com" />
        </label>
        <label>
          Nivel
          <select name="nivel" value={formulario.nivel} onChange={actualizarCampo} required>
            <option value="">Selecciona el rango de edad</option>
            <option value="12-14">De 12 a 14 años</option>
            <option value="15-17">De 15 a 17 años</option>
          </select>
        </label>
        <label>
          Contraseña inicial
          <input type="password" name="password" value={formulario.password} onChange={actualizarCampo} autoComplete="new-password" minLength={8} maxLength={128} required placeholder="Al menos 8 caracteres" />
        </label>
        <label>
          Confirma la contraseña inicial
          <input type="password" name="confirmarPassword" value={formulario.confirmarPassword} onChange={actualizarCampo} autoComplete="new-password" minLength={8} maxLength={128} required placeholder="Escríbela nuevamente" />
        </label>
        <p className="admin-enrollment-note">La contraseña se guarda cifrada. Entrégasela al estudiante por un canal privado.</p>
        {mensaje && <p className={esError ? 'admin-enrollment-error' : 'admin-enrollment-success'} role="status">{mensaje}</p>}
        <button className="button-primary" type="submit" disabled={cargando}>
          {cargando ? 'Guardando inscripción...' : 'Inscribir alumno y crear acceso'}
        </button>
      </form>
    </section>
  );
}

export default AdminEnrollmentForm;
