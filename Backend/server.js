const express = require('express'); 
const cors = require('cors'); 
const mongoose = require('mongoose'); 
const dns = require('dns'); 
const Alumno = require('./models/Alumno'); 
const Contacto = require('./models/Contacto'); 
 
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

// Guardar mensaje de contacto 
app.post('/api/contacto', async (req, res) => { 
    try { 
        const contacto = new Contacto(req.body); 
 
        const contactoGuardado = await contacto.save(); 
 
        res.status(201).json({ 
            exito: true, 
            mensaje: 'Mensaje enviado correctamente', 
            contacto: contactoGuardado 
        }); 
 
    } catch (error) { 
        res.status(400).json({ 
            exito: false, 
            mensaje: 'No se pudo guardar el mensaje', 
            error: error.message 
        }); 
    } 
});

 // Obtener mensajes de contacto
app.get('/api/contacto', async (req, res) => {
    try {
        const mensajes = await Contacto.find().sort({ fechaEnvio: -1 });

        res.json({
            exito: true,
            total: mensajes.length,
            mensajes: mensajes
        });

    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'No se pudieron obtener los mensajes',
            error: error.message
        });
    }
});


 // Obtener alumnos para el panel de administración
app.get('/api/admin/alumnos', async (req, res) => {
    try {
        const alumnos = await Alumno.find().sort({ nombre: 1 });

        res.json({
            exito: true,
            total: alumnos.length,
            alumnos: alumnos
        });

    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'No se pudieron obtener los alumnos',
            error: error.message
        });
    }
});


 // Inicio de sesión del administrador
app.post('/api/admin/login', (req, res) => {
    const { usuario, password } = req.body;

    if (
        usuario !== process.env.ADMIN_USER ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        return res.status(401).json({
            exito: false,
            mensaje: 'Usuario o contraseña incorrectos'
        });
    }

    res.json({
        exito: true,
        mensaje: 'Inicio de sesión correcto',
        usuario: process.env.ADMIN_USER,
        nombre: 'Directora',
        token: 'token-de-prueba-local'
    });
});
