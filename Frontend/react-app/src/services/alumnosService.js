
import { apiUrl } from './api';

/**
 * Consulta los alumnos de la API protegida.
 * Recibe el token de una sesión administrativa válida.
 */
export async function obtenerAlumnos(token) {
  if (!token) {
    throw new Error('Debes iniciar sesión para consultar los alumnos.');
  }

  const respuesta = await fetch(apiUrl('/alumnos'), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await respuesta.json();

  if (!respuesta.ok || !data.exito) {
    throw new Error(
      data.mensaje || 'No se pudieron consultar los alumnos.'
    );
  }

  return data.alumnos;
}

export async function asignarContrasenaAlumno(alumnoId, password, token) {
  const respuesta = await fetch(apiUrl(`/admin/alumnos/${alumnoId}/password`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });
  const datos = await respuesta.json();

  if (!respuesta.ok || !datos.exito) {
    throw new Error(datos.mensaje || 'No se pudo actualizar la contraseña.');
  }
}

// El formulario administrativo manda el token para que solo la academia pueda dar de alta cuentas.
export async function crearAlumnoDesdePanel(datosAlumno, token) {
  const respuesta = await fetch(apiUrl('/admin/alumnos'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datosAlumno),
  });
  const datos = await respuesta.json();

  if (!respuesta.ok || !datos.exito) {
    throw new Error(datos.mensaje || 'No se pudo inscribir al alumno.');
  }

  return datos.alumno;
}
