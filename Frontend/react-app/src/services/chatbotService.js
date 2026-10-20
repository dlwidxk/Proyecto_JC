import { apiUrl } from './api';

/* Enviamos la pregunta al servidor y recibimos la respuesta de la IA */
export async function enviarPreguntaChatbot(mensaje, historial = []) {
  const respuesta = await fetch(apiUrl('/chat'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mensaje, historial }),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok || !datos.exito) {
    throw new Error(
      datos.mensaje || 'No se pudo obtener una respuesta del asistente.'
    );
  }

  return datos.respuesta;
}
