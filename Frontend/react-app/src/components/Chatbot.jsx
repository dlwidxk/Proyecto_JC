import { useState } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      tipo: 'bot',
      texto: '¡Hola! Soy el asistente de Fórmula Exacta. ¿En qué puedo ayudarte?'
    }
  ]);

  function enviarMensaje(evento) {
    evento.preventDefault();

    const texto = mensaje.trim();

    if (!texto) return;

    // Guardamos el mensaje que escribe el usuario.
    setMensajes((anteriores) => [
      ...anteriores,
      {
        id: Date.now(),
        tipo: 'usuario',
        texto
      }
    ]);

    setMensaje('');
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
            />

            <button type="submit" disabled={!mensaje.trim()}>
              Enviar
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