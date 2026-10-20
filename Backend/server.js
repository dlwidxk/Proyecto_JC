const express = require('express'); 
const cors = require('cors'); 
const mongoose = require('mongoose'); 
const dns = require('dns'); 
const Alumno = require('./models/Alumno'); 
const Contacto = require('./models/Contacto'); 
const { prepararBaseDeConocimiento, responderDesdeConocimiento } = require('./chatbot/knowledge');
const jwt = require('jsonwebtoken');
const { randomBytes, scrypt: scryptCallback, timingSafeEqual } = require('crypto');
const { promisify } = require('util');
 
require('dotenv').config(); 
 
// Usar DNS de Cloudflare y Google 
dns.setServers(['1.1.1.1', '8.8.8.8']); 
 
const app = express(); 
const PORT = process.env.PORT || 2323; 
const scrypt = promisify(scryptCallback);

async function crearHashContrasena(contrasena) {
    const salt = randomBytes(16).toString('hex');
    const claveDerivada = await scrypt(contrasena, salt, 64);
    return `${salt}:${claveDerivada.toString('hex')}`;
}

async function verificarContrasena(contrasena, hashGuardado) {
    const [salt, hashHex] = (hashGuardado || '').split(':');
    if (!salt || !hashHex) return false;

    const claveEsperada = Buffer.from(hashHex, 'hex');
    const claveRecibida = await scrypt(contrasena, salt, claveEsperada.length);
    return claveEsperada.length > 0 && timingSafeEqual(claveEsperada, claveRecibida);
}
 
// En producción limita las llamadas del navegador al sitio publicado.
const origenesConfigurados = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origen) => origen.trim())
    .filter(Boolean);
const origenesPermitidos = origenesConfigurados.length > 0
    ? origenesConfigurados
    : process.env.NODE_ENV === 'production'
        ? []
        : ['http://localhost:5173'];

app.use(cors({
    origin(origen, callback) {
        // Herramientas locales y solicitudes servidor a servidor no envían Origin.
        if (!origen || origenesPermitidos.includes(origen)) {
            return callback(null, true);
        }

        return callback(null, false);
    }
}));
app.use(express.json()); 
 
// Verificar el token del administrador
const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            exito: false,
            mensaje: 'Acceso denegado. Debes iniciar sesión.'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const datos = jwt.verify(token, process.env.JWT_SECRET);

        if (datos.usuario !== process.env.ADMIN_USER) {
            return res.status(403).json({
                exito: false,
                mensaje: 'No tienes permiso para acceder.'
            });
        }

        req.admin = datos;
        next();

    } catch (error) {
        return res.status(401).json({
            exito: false,
            mensaje: 'La sesión es inválida o ha expirado.'
        });
    }
};

const verificarTokenAlumno = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ exito: false, mensaje: 'Inicia sesión para continuar.' });
    }

    try {
        const datos = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        if (datos.tipo !== 'alumno' || !datos.sub) {
            return res.status(403).json({ exito: false, mensaje: 'Este acceso es solo para estudiantes.' });
        }

        req.alumnoId = datos.sub;
        return next();
    } catch (error) {
        return res.status(401).json({ exito: false, mensaje: 'La sesión venció. Inicia sesión nuevamente.' });
    }
};
// Conectar con MongoDB 
mongoose.connect(process.env.MONGODB_URI) 
    .then(async () => {
        console.log('MongoDB conectado correctamente'); 

        try {
            await prepararBaseDeConocimiento();
            console.log(`Conocimiento del chatbot listo en ${process.env.CHATBOT_DB_NAME || 'formula-exacta-chatbot'}`);
        } catch (error) {
            console.error('No se pudo preparar la base de conocimiento del chatbot:', error.message);
        }
 
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

 // Consultar alumnos desde el frontend
app.get('/api/alumnos', verificarToken, async (req, res) => {
    try {
        const alumnos = await Alumno.find()
            .select('nombre email nivel materias estado');

        res.json({
            exito: true,
            total: alumnos.length,
            alumnos: alumnos
        });

    } catch (error) {
        res.status(500).json({
            exito: false,
            mensaje: 'No se pudieron consultar los alumnos'
        });
    }
});

// La academia crea cada cuenta desde el panel; aquí no dejamos altas públicas.
app.post('/api/admin/alumnos', verificarToken, async (req, res) => {
    try {
        const { nombre, email, nivel, password } = req.body || {};
        const nombreLimpio = typeof nombre === 'string' ? nombre.trim() : '';
        const emailLimpio = typeof email === 'string' ? email.trim().toLowerCase() : '';

        if (!nombreLimpio || nombreLimpio.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio)) {
            return res.status(400).json({ exito: false, mensaje: 'Revisa tu nombre y correo electrónico.' });
        }
        if (!['12-14', '15-17'].includes(nivel)) {
            return res.status(400).json({ exito: false, mensaje: 'Selecciona uno de los niveles disponibles.' });
        }
        if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
            return res.status(400).json({ exito: false, mensaje: 'La contraseña debe tener entre 8 y 128 caracteres.' });
        }

        const alumnoExistente = await Alumno.findOne({ email: emailLimpio });
        if (alumnoExistente) {
            return res.status(409).json({
                exito: false,
                mensaje: 'Ya existe una inscripción con ese correo. Si ya eres alumno, inicia sesión o contacta a la academia para activar tu acceso.'
            });
        }

        const passwordHash = await crearHashContrasena(password);
        const alumno = await Alumno.create({
            nombre: nombreLimpio,
            email: emailLimpio,
            nivel,
            passwordHash
        });

        return res.status(201).json({
            exito: true,
            mensaje: 'Alumno inscrito correctamente. Ya puede iniciar sesión.',
            alumno: {
                id: alumno.id,
                nombre: alumno.nombre,
                email: alumno.email,
                nivel: alumno.nivel
            }
        });
    } catch (error) {
        console.error('Error al inscribir al alumno desde el panel:', error.message);
        return res.status(500).json({ exito: false, mensaje: 'No se pudo inscribir al alumno. Inténtalo nuevamente.' });
    }
});

app.post('/api/alumnos/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
        return res.status(400).json({ exito: false, mensaje: 'Escribe tu correo y contraseña.' });
    }
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ exito: false, mensaje: 'El acceso estudiantil no está configurado.' });
    }

    try {
        const alumno = await Alumno.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
        const contrasenaValida = alumno && await verificarContrasena(password, alumno.passwordHash);
        if (!contrasenaValida) {
            return res.status(401).json({ exito: false, mensaje: 'Correo o contraseña incorrectos.' });
        }

        const token = jwt.sign(
            { sub: alumno.id, tipo: 'alumno' },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );
        return res.json({
            exito: true,
            token,
            alumno: {
                id: alumno.id,
                nombre: alumno.nombre,
                email: alumno.email,
                nivel: alumno.nivel,
                materias: alumno.materias,
                estado: alumno.estado
            }
        });
    } catch (error) {
        console.error('Error en el inicio de sesión estudiantil:', error.message);
        return res.status(500).json({ exito: false, mensaje: 'No se pudo iniciar sesión.' });
    }
});

app.get('/api/alumnos/me', verificarTokenAlumno, async (req, res) => {
    try {
        const alumno = await Alumno.findById(req.alumnoId)
            .select('nombre email nivel materias estado');
        if (!alumno) {
            return res.status(404).json({ exito: false, mensaje: 'No se encontró tu cuenta.' });
        }
        return res.json({ exito: true, alumno });
    } catch (error) {
        return res.status(500).json({ exito: false, mensaje: 'No se pudo consultar tu cuenta.' });
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
app.get('/api/contacto', verificarToken, async (req, res) => {
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

// Marcar como leído desde el panel administrativo.
app.patch('/api/contacto/:id/leido', verificarToken, async (req, res) => {
    try {
        const contacto = await Contacto.findByIdAndUpdate(
            req.params.id,
            { leido: true },
            { new: true, runValidators: true }
        );

        if (!contacto) {
            return res.status(404).json({
                exito: false,
                mensaje: 'No se encontró el mensaje seleccionado.'
            });
        }

        return res.json({ exito: true, contacto });
    } catch (error) {
        return res.status(400).json({
            exito: false,
            mensaje: 'No se pudo actualizar el mensaje.'
        });
    }
});


 // Obtener alumnos para el panel de administración
app.get('/api/admin/alumnos', verificarToken, async (req, res) => {
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

app.put('/api/admin/alumnos/:id/password', verificarToken, async (req, res) => {
    const { password } = req.body || {};
    if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
        return res.status(400).json({
            exito: false,
            mensaje: 'La contraseña debe tener entre 8 y 128 caracteres.'
        });
    }

    try {
        const alumno = await Alumno.findById(req.params.id);
        if (!alumno) {
            return res.status(404).json({ exito: false, mensaje: 'No se encontró el alumno.' });
        }

        alumno.passwordHash = await crearHashContrasena(password);
        await alumno.save();
        return res.json({ exito: true, mensaje: 'Contraseña actualizada correctamente.' });
    } catch (error) {
        return res.status(400).json({ exito: false, mensaje: 'No se pudo actualizar la contraseña.' });
    }
});


// Inicio de sesión del administrador
app.post('/api/admin/login', (req, res) => {
    const { usuario, password } = req.body;

    if (
        !usuario ||
        !password ||
        usuario !== process.env.ADMIN_USER ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        return res.status(401).json({
            exito: false,
            mensaje: 'Usuario o contraseña incorrectos'
        });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Falta configurar la clave secreta del servidor'
        });
    }

    const token = jwt.sign(
        { usuario: process.env.ADMIN_USER },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({
        exito: true,
        mensaje: 'Inicio de sesión correcto',
        usuario: process.env.ADMIN_USER,
        nombre: 'Directora',
        token
    });
});

/* El chat busca respuestas en la base separada con la información de la academia. */
app.post('/api/chat', async (req, res) => {
    const { mensaje } = req.body;

    if (typeof mensaje !== 'string' || !mensaje.trim()) {
        return res.status(400).json({
            exito: false,
            mensaje: 'Escribe una pregunta para continuar.'
        });
    }

    if (mensaje.length > 1000) {
        return res.status(400).json({
            exito: false,
            mensaje: 'Tu pregunta no puede superar los 1000 caracteres.'
        });
    }

    try {
        const respuesta = await responderDesdeConocimiento(mensaje.trim());
        return res.json({ exito: true, respuesta });
    } catch (error) {
        console.error('Error al consultar la base de conocimiento del chatbot:', error.message);
        return res.status(502).json({
            exito: false,
            mensaje: 'No pude consultar la información ahora. Inténtalo de nuevo en un momento.'
        });
    }
});
