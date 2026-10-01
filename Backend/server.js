const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('dns');
const Alumno = require('./models/Alumno');

require('dotenv').config();

// Usar DNS de Cloudflare y Google
dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();
const PORT = process.env.PORT || 2323;

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar con MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB conectado correctamente');

        app.listen(PORT, () => {
            console.log(`El servidor está funcionando en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al conectar con MongoDB:');
        console.error(error.message);
    });

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        mensaje: 'Backend de Fórmula Exacta funcionando',
        baseDeDatos: 'MongoDB'
    });
});
// Crear un alumno
app.post('/api/alumnos', async (req, res) => {
    try {
        const alumno = new Alumno(req.body);

        const alumnoGuardado = await alumno.save();

        res.status(201).json({
            exito: true,
            alumno: alumnoGuardado
        });

    } catch (error) {
        res.status(400).json({
            exito: false,
            mensaje: 'No se pudo guardar el alumno',
            error: error.message
        });
    }
});