import { apiUrl } from './api';

export async function obtenerContactos(token) {
  if (!token) {
    throw new Error('Debes iniciar sesión para consultar los mensajes.');
  }

  const respuesta = await fetch(apiUrl('/contacto'), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const datos = await respuesta.json();

  if (!respuesta.ok || !datos.exito) {
    throw new Error(datos.mensaje || 'No se pudieron consultar los mensajes.');
  }

  return datos.mensajes;
}

export async function marcarContactoLeido(id, token) {
  const respuesta = await fetch(apiUrl(`/contacto/${id}/leido`), {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  const datos = await respuesta.json();

  if (!respuesta.ok || !datos.exito) {
    throw new Error(datos.mensaje || 'No se pudo actualizar el mensaje.');
  }

  return datos.contacto;
}
