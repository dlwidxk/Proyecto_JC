const mongoose = require('mongoose');

const conocimientoChatSchema = new mongoose.Schema({
    clave: { type: String, required: true, unique: true },
    categoria: { type: String, required: true, trim: true },
    titulo: { type: String, required: true, trim: true },
    contenido: { type: String, required: true, trim: true },
    palabrasClave: { type: [String], default: [] },
    activo: { type: Boolean, default: true },
    orden: { type: Number, default: 0 }
}, { timestamps: true });

// Cada modelo se crea sobre la conexión separada que recibe, sin mezclar datos de alumnos.
function crearModeloChatbotKnowledge(conexion) {
    return conexion.models.ChatbotKnowledge
        || conexion.model('ChatbotKnowledge', conocimientoChatSchema, 'conocimientos');
}

module.exports = crearModeloChatbotKnowledge;
