
const API_URL = 'http://localhost:2323/api';

/**
 * Consulta los alumnos de la API protegida.
 * Recibe el token de una sesión administrativa válida.
 */
export async function obtenerAlumnos(token) {
  if (!token) {
    throw new Error('Debes iniciar sesión para consultar los alumnos.');
  }

  const respuesta = await fetch(`${API_URL}/alumnos`, {
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
