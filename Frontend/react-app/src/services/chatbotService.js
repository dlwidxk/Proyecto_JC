import { apiUrl } from './api';

/* Enviamos la pregunta y mostramos la respuesta que encuentra el asistente. */
export async function enviarPreguntaChatbot(mensaje) {
  const respuesta = await fetch(apiUrl('/chat'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mensaje }),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok || !datos.exito) {
    throw new Error(
      datos.mensaje || 'No se pudo obtener una respuesta del asistente.'
    );
  }

  return datos.respuesta;
}
