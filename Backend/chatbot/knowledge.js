const crearModeloChatbotKnowledge = require('../models/ChatbotKnowledge');

const conocimientosIniciales = [
    {
        clave: 'academia', categoria: 'La academia', titulo: 'Fórmula Exacta',
        contenido: 'Fórmula Exacta es una academia online para jóvenes que ofrece acompañamiento personalizado en Matemáticas, Física y Cálculo.',
        palabrasClave: ['academia', 'sitio', 'web', 'quienes', 'somos', 'clases', 'online', 'virtual', 'que hacen']
    },
    {
        clave: 'nivel-12-14', categoria: 'Cursos', titulo: 'Programa para estudiantes de 12 a 14 años',
        contenido: 'Exploradores de Matemáticas y Física. Matemáticas: aritmética, álgebra básica, geometría y estadística. Física: introducción, movimiento, fuerzas y energía. Incluye dos clases en vivo por semana. El programa dura cuatro meses por materia.',
        palabrasClave: ['12', '14', 'doce', 'catorce', 'joven', 'edad', 'exploradores', 'matematica', 'fisica', 'aritmetica', 'algebra basica', 'geometria', 'estadistica', 'movimiento', 'fuerzas', 'energia', 'dos clases', 'temas', 'aprenden', 'ensenan']
    },
    {
        clave: 'nivel-15-17', categoria: 'Cursos', titulo: 'Programa para estudiantes de 15 a 17 años',
        contenido: 'Dominando las Ciencias Exactas. Matemáticas: álgebra avanzada, trigonometría, geometría analítica y precálculo. Física: mecánica, termodinámica, ondas, electricidad y óptica. Cálculo: límites, derivadas, integrales y aplicaciones. Incluye tres clases en vivo por semana, cuatro meses por materia y certificado de finalización con mención en Cálculo.',
        palabrasClave: ['15', '17', 'quince', 'diecisiete', 'adolescente', 'edad', 'dominando', 'matematica', 'fisica', 'calculo', 'trigonometria', 'precalculo', 'derivadas', 'integrales', 'mecanica', 'ondas', 'electricidad', 'optica', 'certificado', 'tres clases', 'temas', 'aprenden', 'ensenan']
    },
    {
        clave: 'beneficios', categoria: 'Planes y beneficios', titulo: 'Qué incluyen los planes',
        contenido: 'Todos los planes incluyen clases en vivo, grabaciones disponibles 24/7, materiales de estudio descargables, tareas semanales con retroalimentación, acompañamiento para resolver dudas y acceso a Microsoft Teams.',
        palabrasClave: ['incluye', 'incluyen', 'beneficios', 'grabaciones', 'videos', 'materiales', 'guias', 'tareas', 'retroalimentacion', 'dudas', 'teams', 'clases en vivo', 'disponible', '24/7']
    },
    {
        clave: 'portal-estudiantil', categoria: 'Portal estudiantil', titulo: 'Acceso a recursos del estudiante',
        contenido: 'El portal estudiantil organiza recursos por grupo de edad y materia. Para entrar se necesitan las credenciales personales que entrega la academia. Si una cuenta todavía no está activa o se perdió el acceso, se puede solicitar ayuda por el formulario de Contacto o por WhatsApp.',
        palabrasClave: ['portal', 'estudiante', 'estudiantil', 'iniciar sesion', 'login', 'cuenta', 'contrasena', 'credenciales', 'acceso', 'recursos', 'activar']
    },
    {
        clave: 'recursos-12-14', categoria: 'Recursos estudiantiles', titulo: 'Recursos para el grupo de 12 a 14 años',
        contenido: 'En Matemáticas hay un recurso sobre el teorema de Pitágoras con video integrado; en Física, un recurso sobre movimiento y aceleración con video integrado. En el portal aparece como horario de ejemplo martes y jueves de 19:00 a 21:30, hora de Ecuador. Ese horario de la página es referencial y se debe confirmar con la academia.',
        palabrasClave: ['12', '13', '14', 'doce', 'trece', 'catorce', 'recursos', 'video', 'videos', 'pitagoras', 'triangulo', 'matematica', 'movimiento', 'aceleracion', 'fisica', 'horario', 'martes', 'jueves']
    },
    {
        clave: 'recursos-15-17', categoria: 'Recursos estudiantiles', titulo: 'Recursos para el grupo de 15 a 17 años',
        contenido: 'En Matemáticas hay un recurso de ecuaciones lineales con video integrado; en Física, uno sobre la primera ley de Newton; y en Cálculo, uno sobre reglas para derivar polinomios. En el portal aparece como horario de ejemplo lunes, miércoles y viernes de 19:00 a 21:30, hora de Ecuador. Ese horario de la página es referencial y se debe confirmar con la academia.',
        palabrasClave: ['15', '16', '17', 'quince', 'dieciseis', 'diecisiete', 'recursos', 'video', 'videos', 'ecuaciones', 'algebra', 'matematica', 'newton', 'fisica', 'derivadas', 'polinomios', 'calculo', 'horario', 'lunes', 'miercoles', 'viernes']
    },
    {
        clave: 'precios-12-14', categoria: 'Precios', titulo: 'Precios del nivel de 12 a 14 años',
        contenido: 'Para el nivel de 12 a 14 años: plan mensual $45 USD al mes, plan de cinco meses $200 USD y plan de diez meses $380 USD. La web recomienda consultar disponibilidad antes de inscribirse.',
        palabrasClave: ['precio', 'precios', 'cuesta', 'costo', 'pagar', 'mensualidad', 'mensual', 'mes', '12', '14', 'doce', 'catorce', '45', '200', '380', 'cinco meses', 'diez meses', 'plan']
    },
    {
        clave: 'precios-15-17', categoria: 'Precios', titulo: 'Precios del nivel de 15 a 17 años',
        contenido: 'Para el nivel de 15 a 17 años: plan mensual $60 USD al mes, plan de cinco meses $270 USD y plan de diez meses $510 USD. La web recomienda consultar disponibilidad antes de inscribirse.',
        palabrasClave: ['precio', 'precios', 'cuesta', 'costo', 'pagar', 'mensualidad', 'mensual', 'mes', '15', '17', 'quince', 'diecisiete', '60', '270', '510', 'cinco meses', 'diez meses', 'plan']
    },
    {
        clave: 'descuentos', categoria: 'Precios', titulo: 'Descuentos publicados',
        contenido: 'El sitio publica un descuento del 15% para hermanos y del 10% por pago anual anticipado. Las condiciones y la disponibilidad se deben confirmar con la academia.',
        palabrasClave: ['descuento', 'descuentos', 'hermanos', 'familia', 'anual', 'anticipado', 'promocion', 'oferta', 'rebaja', '15%', '10%']
    },
    {
        clave: 'duracion-y-frecuencia', categoria: 'Cursos', titulo: 'Duración y frecuencia de clases',
        contenido: 'Cada materia tiene un programa de cuatro meses. El grupo de 12 a 14 años tiene dos clases en vivo por semana y el de 15 a 17 años tiene tres, incluido Cálculo. Los horarios publicados en el portal estudiantil son ejemplos; para confirmar el horario vigente se debe consultar con la academia.',
        palabrasClave: ['duracion', 'dura', 'cuanto tiempo', 'meses', 'frecuencia', 'cuantas clases', 'clases por semana', 'horario', 'hora', 'dias', 'semana', '12', '14', '15', '17']
    },
    {
        clave: 'inscripciones', categoria: 'Inscripciones', titulo: 'Cómo consultar una inscripción',
        contenido: 'Las familias pueden consultar una inscripción por WhatsApp al +593 96 020 3174 o enviar un mensaje desde el formulario de Contacto. El equipo registra a cada nuevo alumno y le entrega su acceso personal al portal; la inscripción oficial se gestiona desde el equipo de la academia.',
        palabrasClave: ['inscripcion', 'inscribirse', 'inscribo', 'inscribir', 'matricula', 'reservar', 'reservar cupo', 'cupo', 'whatsapp', 'contacto', 'registrarse', 'alumno', 'acceso', 'formulario']
    },
    {
        clave: 'contacto', categoria: 'Contacto', titulo: 'Datos de contacto',
        contenido: 'Puedes escribir al correo info@formulaexacta.com, enviar un WhatsApp al +593 96 020 3174 o usar el formulario de Contacto del sitio. Las redes sociales de la academia aparecen como @formulaexacta en Instagram, Facebook y TikTok.',
        palabrasClave: ['contacto', 'correo', 'email', 'mail', 'telefono', 'whatsapp', 'redes', 'instagram', 'facebook', 'tiktok', 'mensaje', 'escribir', 'hablar']
    },
    {
        clave: 'mision', categoria: 'La academia', titulo: 'Misión',
        contenido: 'Empoderar a jóvenes con herramientas matemáticas y científicas para transformar su futuro mediante una educación accesible, innovadora y de calidad.',
        palabrasClave: ['mision', 'proposito', 'objetivo', 'para que existe']
    },
    {
        clave: 'vision-valores', categoria: 'La academia', titulo: 'Visión y valores',
        contenido: 'La visión es ser una academia online de referencia en América Latina, formando pensadores críticos y resolutivos. Sus valores son excelencia académica, cercanía y acompañamiento, innovación constante y compromiso con el progreso.',
        palabrasClave: ['vision', 'valores', 'excelencia', 'cercania', 'acompanamiento', 'innovacion', 'progreso', 'america latina']
    }
];

let modeloPreparado;

function normalizar(texto) {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9%+@.\s-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Guardamos el contenido publicado una vez; si más adelante se edita en Mongo, no se pisa al reiniciar.
async function prepararBaseDeConocimiento() {
    if (modeloPreparado) return modeloPreparado;

    modeloPreparado = prepararRegistrosIniciales();
    try {
        return await modeloPreparado;
    } catch (error) {
        modeloPreparado = undefined;
        throw error;
    }
}

async function prepararRegistrosIniciales() {
    const nombreBase = process.env.CHATBOT_DB_NAME || 'formula-exacta-chatbot';
    const conexionChatbot = require('mongoose').connection.useDb(nombreBase, { useCache: true });
    const Conocimiento = crearModeloChatbotKnowledge(conexionChatbot);
    const operaciones = conocimientosIniciales.map((dato, orden) => ({
        updateOne: {
            filter: { clave: dato.clave },
            update: { $setOnInsert: { ...dato, orden, activo: true } },
            upsert: true
        }
    }));

    await Conocimiento.bulkWrite(operaciones, { ordered: false });
    return Conocimiento;
}

function puntuar(pregunta, conocimiento) {
    const texto = normalizar(pregunta);
    const tokens = [...new Set(texto.split(' ').filter((token) => token.length > 1))];
    const titulo = normalizar(conocimiento.titulo);
    const palabrasClave = conocimiento.palabrasClave.map(normalizar);
    const contenido = normalizar(conocimiento.contenido);
    let puntos = 0;

    for (const token of tokens) {
        if (titulo.includes(token)) puntos += 4;
        if (palabrasClave.some((palabra) => palabra === token || palabra.includes(token))) puntos += 3;
        else if (contenido.includes(token)) puntos += 1;
    }

    for (const frase of palabrasClave.filter((palabra) => palabra.includes(' '))) {
        if (texto.includes(frase)) puntos += 4;
    }

    // Si mencionan una edad concreta, damos prioridad al grupo correspondiente.
    const edadMenor = /\b(12|13|14|doce|trece|catorce)\b/.test(texto);
    const edadMayor = /\b(15|16|17|quince|dieciseis|diecisiete)\b/.test(texto);
    if (edadMenor && /12-14/.test(conocimiento.clave)) puntos += 9;
    if (edadMayor && /15-17/.test(conocimiento.clave)) puntos += 9;
    if (edadMenor && /15-17/.test(conocimiento.clave)) puntos -= 8;
    if (edadMayor && /12-14/.test(conocimiento.clave)) puntos -= 8;
    return puntos;
}

async function responderDesdeConocimiento(mensaje) {
    const Conocimiento = await prepararBaseDeConocimiento();
    const registros = await Conocimiento.find({ activo: true })
        .sort({ orden: 1 })
        .select('clave categoria titulo contenido palabrasClave')
        .lean();

    const texto = normalizar(mensaje);
    if (/^(hola|buenas|buenos dias|buenas tardes|buenas noches|hey|saludos)(\s|$)/.test(texto)) {
        return '¡Hola! Puedo ayudarte con los cursos, precios, horarios, recursos e inscripciones de Fórmula Exacta. ¿Qué te gustaría saber?';
    }
    if (/(gracias|muchas gracias)/.test(texto)) {
        return '¡Con gusto! Si tienes otra consulta sobre los cursos o la academia, aquí estoy para ayudarte.';
    }

    const mencionaEdad = /\b(12|13|14|doce|trece|catorce|15|16|17|quince|dieciseis|diecisiete)\b/.test(texto);
    const preguntaPrecios = /(precio|precios|cuesta|costo|pagar|mensualidad|valor|cobran|plan)/.test(texto);
    const preguntaDescuentos = /(descuento|descuentos|hermanos|promocion|oferta|rebaja)/.test(texto);
    const preguntaCursos = /(curso|cursos|programa|programas|materia|materias|asignatura|asignaturas|temas|aprenden|ensenan)/.test(texto);
    const preguntaRecursos = /(recurso|recursos|video|videos)/.test(texto);

    if (!mencionaEdad && preguntaPrecios) {
        const precios = registros
            .filter((dato) => dato.clave.startsWith('precios-'))
            .map((dato) => dato.contenido)
            .join('\n\n');
        if (!preguntaDescuentos) return precios;

        const descuentos = registros.find((dato) => dato.clave === 'descuentos');
        return [precios, descuentos?.contenido].filter(Boolean).join('\n\n');
    }
    if (!mencionaEdad && preguntaDescuentos) {
        return registros.find((dato) => dato.clave === 'descuentos')?.contenido
            || 'Puedes consultar los descuentos vigentes con la academia.';
    }
    if (!mencionaEdad && preguntaCursos) {
        return registros
            .filter((dato) => dato.clave.startsWith('nivel-'))
            .map((dato) => dato.contenido)
            .join('\n\n');
    }
    if (!mencionaEdad && preguntaRecursos) {
        return registros
            .filter((dato) => dato.clave.startsWith('recursos-'))
            .map((dato) => dato.contenido)
            .join('\n\n');
    }

    const mejorCoincidencia = registros
        .map((dato) => ({ dato, puntos: puntuar(mensaje, dato) }))
        .sort((a, b) => b.puntos - a.puntos)[0];

    if (!mejorCoincidencia || mejorCoincidencia.puntos < 3) {
        return 'No encuentro ese dato entre la información publicada de la academia. Puedes consultarlo por WhatsApp al +593 96 020 3174 o escribir desde el formulario de Contacto.';
    }

    return mejorCoincidencia.dato.contenido;
}

module.exports = { prepararBaseDeConocimiento, responderDesdeConocimiento };
