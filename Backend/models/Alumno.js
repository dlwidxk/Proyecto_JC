const mongoose = require('mongoose');

const alumnoSchema = new mongoose.Schema({
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

    nivel: {
        type: String,
        required: true,
        enum: ['12-14', '15-17']
    },

    materias: {
        type: [String],
        default: []
    },

    estado: {
        type: String,
        default: 'Activo'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Alumno', alumnoSchema);