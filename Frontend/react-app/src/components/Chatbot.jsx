import { useState } from 'react';
import { enviarPreguntaChatbot } from '../services/chatbotService';
import './Chatbot.css';

function Chatbot() {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      tipo: 'bot',
      texto: '¡Hola! Soy el asistente de Fórmula Exacta. ¿En qué puedo ayudarte?'
    }
  ]);

  async function enviarMensaje(evento) {
    evento.preventDefault();

    const texto = mensaje.trim();

    // Evitamos enviar mensajes vacíos o varias preguntas a la vez.
    if (!texto || cargando) return;

    setMensajes((anteriores) => [
      ...anteriores,
      {
        id: Date.now(),
        tipo: 'usuario',
        texto
      }
    ]);

    setMensaje('');
    setCargando(true);

    try {
      // Consultamos las respuestas guardadas por la academia en su base de conocimiento.
      const respuesta = await enviarPreguntaChatbot(texto);

      setMensajes((anteriores) => [
        ...anteriores,
        {
          id: Date.now() + 1,
          tipo: 'bot',
          texto: respuesta || 'No recibí una respuesta. Inténtalo de nuevo.'
        }
      ]);
    } catch (error) {
      setMensajes((anteriores) => [
        ...anteriores,
        {
          id: Date.now() + 1,
          tipo: 'bot',
          texto: error.message || 'No pude conectarme. Inténtalo de nuevo.'
        }
      ]);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="chatbot">
      {abierto && (
        <section
          className="chatbot-ventana"
          aria-label="Chat de Fórmula Exacta"
        >
          <header className="chatbot-cabecera">
            <div>
              <h2>Fórmula Exacta</h2>
              <p>Asistente virtual</p>
            </div>

            <button
              type="button"
              className="chatbot-cerrar"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar chat"
            >
              ×
            </button>
          </header>

          <div className="chatbot-mensajes" aria-live="polite">
            {mensajes.map((item) => (
              <div
                key={item.id}
                className={`chatbot-mensaje ${item.tipo}`}
              >
                {item.texto}
              </div>
            ))}

            {cargando && (
              <div className="chatbot-mensaje bot" role="status">
                Estoy preparando tu respuesta...
              </div>
            )}
          </div>

          <form
            className="chatbot-formulario"
            onSubmit={enviarMensaje}
          >
            <input
              type="text"
              value={mensaje}
              onChange={(evento) => setMensaje(evento.target.value)}
              placeholder="Escribe tu pregunta..."
              aria-label="Escribe tu mensaje"
              maxLength={1000}
              disabled={cargando}
            />

            <button
              type="submit"
              disabled={!mensaje.trim() || cargando}
            >
              {cargando ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="chatbot-boton"
        onClick={() => setAbierto((estado) => !estado)}
        aria-label={abierto ? 'Cerrar asistente' : 'Abrir asistente'}
        aria-expanded={abierto}
      >
        {abierto ? '×' : '💬'}
      </button>
    </div>
  );
}

export default Chatbot;
