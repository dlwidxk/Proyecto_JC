const mongoose = require('mongoose');

const contactoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    telefono: {
        type: String,
        default: '',
        trim: true
    },

    nivel: {
        type: String,
        required: true,
        enum: ['12-14', '15-17']
    },

    mensaje: {
        type: String,
        required: true,
        trim: true
    },

    fechaEnvio: {
        type: Date,
        default: Date.now
    },

    leido: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Contacto', contactoSchema);