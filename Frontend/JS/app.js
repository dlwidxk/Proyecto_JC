/*Aquí va toda la lógica del sitio público*/
/*Este archivo se carga en index, nosotros, cursos, precios y contacto*/

/*CONFIGURACIÓN GLOBAL DE LA ACADEMIA*/
/*Uso un objeto para agrupar los datos importantes en un solo lugar*/
/*Si algún día cambio la URL del backend, solo modifico esta propiedad*/
const CONFIG = {
    apiUrl: 'http://localhost:2323/api',
    nombre: 'Fórmula Exacta',
    email: 'info@formulaexacta.com',
    whatsapp: '+593960203174'
};

/*CONFIGURACIÓN DE LA INTERFAZ*/
/*Otro objeto con detalles visuales para no tener números mágicos en el código*/
const UI = {
    scrollThreshold: 50,
    headerColorTop: 'rgba(17, 24, 39, 0.95)',
    headerColorScrolled: 'rgba(10, 10, 15, 0.98)',
    headerShadow: '0 4px 10px rgba(0, 0, 0, 0.5)'
};

/*MENSAJES DE ERROR DEL FORMULARIO*/
/*Un objeto que mapea cada campo con su mensaje de error específico*/
const MENSAJES_ERROR = {
    nombre: 'Por favor ingresa tu nombre',
    email: 'Por favor ingresa un correo válido',
    nivel: 'Por favor selecciona un nivel',
    mensaje: 'Por favor escribe tu consulta'
};

/*Espero a que el HTML esté cargado antes de ejecutar*/
document.addEventListener('DOMContentLoaded', () => {
    console.log(`🚀 Iniciando ${CONFIG.nombre}...`);

    /*Inicializo todos los módulos del sitio*/
    iniciarScrollHeader();
    iniciarFormularioContacto();

    console.log('✅ Sitio cargado correctamente');
});


/*FUNCIÓN QUE MANEJA EL EFECTO DEL HEADER AL HACER SCROLL*/
const iniciarScrollHeader = () => {
    /*Uso const porque el header no va a cambiar, solo su estilo*/
    const header = document.querySelector('header');
    
    /*Si no existe el header en esta página, salgo de la función*/
    /*Esto es una buena práctica para no ejecutar código innecesario*/
    if (!header) return;

    /*Escucho el evento scroll del navegador*/
    window.addEventListener('scroll', () => {
        /*Uso un condicional ternario para no escribir if/else tan largo*/
        const estaAbajo = window.scrollY > UI.scrollThreshold;
        
        /*Aplico los estilos según la posición*/
        if (estaAbajo) {
            header.style.backgroundColor = UI.headerColorScrolled;
            header.style.boxShadow = UI.headerShadow;
        } else {
            header.style.backgroundColor = UI.headerColorTop;
            header.style.boxShadow = 'none';
        }
    });
};


/*FUNCIÓN QUE MANEJA EL FORMULARIO DE CONTACTO*/
const iniciarFormularioContacto = () => {
    const formulario = document.querySelector('.formulario');
    
    /*Si no hay formulario en esta página, salgo*/
    if (!formulario) return;

    formulario.addEventListener('submit', async (e) => {
        /*Evito que la página se recargue al enviar*/
        e.preventDefault();

        /*Recojo los valores con un objeto para tenerlos agrupados*/
        /*Uso el operador ternario por si el campo teléfono no existe*/
        const datos = {
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefono: document.getElementById('telefono') 
                ? document.getElementById('telefono').value.trim() 
                : '',
            nivel: document.getElementById('nivel').value,
            mensaje: document.getElementById('mensaje').value.trim()
        };

        /*Valido el formulario con una función aparte*/
        const errores = validarFormulario(datos);

        /*Si hay errores, los muestro y detengo el envío*/
        if (errores.length > 0) {
            mostrarErrores(errores);
            return;
        }

        /*Limpio errores previos*/
        limpiarErrores();

        /*Envío los datos al backend*/
        await enviarFormulario(formulario, datos);
    });
};


/*FUNCIÓN QUE VALIDA LOS DATOS DEL FORMULARIO*/
/*Retorna un arreglo con los errores encontrados*/
/*Si el arreglo está vacío, significa que todo está bien*/
const validarFormulario = (datos) => {
    /*Uso un arreglo para acumular los errores*/
    const errores = [];

    /*Recorro los campos obligatorios con for...of*/
    /*Así evito repetir el mismo if para cada campo*/
    const camposObligatorios = ['nombre', 'email', 'nivel', 'mensaje'];

    for (const campo of camposObligatorios) {
        /*Si el campo está vacío, agrego el error al arreglo*/
        if (!datos[campo]) {
            errores.push({ campo, mensaje: MENSAJES_ERROR[campo] });
        }
    }

    /*Validación extra para el email con un condicional simple*/
    /*Si tiene contenido pero no tiene @, es un error*/
    if (datos.email && !datos.email.includes('@')) {
        errores.push({ campo: 'email', mensaje: 'El correo debe contener @' });
    }

    return errores;
};


/*FUNCIÓN QUE MUESTRA LOS ERRORES EN EL FORMULARIO*/
const mostrarErrores = (errores) => {
    /*Recorro los errores con forEach para marcar los campos en rojo*/
    errores.forEach(error => {
        const campo = document.getElementById(error.campo);
        if (campo) {
            campo.classList.add('error');
        }
    });

    /*Muestro el primer mensaje de error al usuario*/
    /*Uso destructuring para sacar el mensaje del primer objeto del arreglo*/
    const [primerError] = errores;
    alert(primerError.mensaje);
    
    console.warn(`⚠️ Se encontraron ${errores.length} errores en el formulario`);
};


/*FUNCIÓN QUE LIMPIA LOS ERRORES DEL FORMULARIO*/
const limpiarErrores = () => {
    /*Uso querySelectorAll para seleccionar todos los campos con error*/
    /*Y forEach para quitarles la clase uno por uno*/
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
};


/*FUNCIÓN QUE ENVÍA EL FORMULARIO AL BACKEND*/
const enviarFormulario = async (formulario, datos) => {
    /*Pongo el botón en modo carga*/
    const boton = formulario.querySelector('button[type="submit"]');
    const textoOriginal = boton.textContent;
    boton.classList.add('btn-loading');
    boton.textContent = '';

    try {
        /*Mando los datos al backend*/
        const respuesta = await fetch(`${CONFIG.apiUrl}/contacto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const data = await respuesta.json();

        /*Uso switch para manejar las posibles respuestas del servidor*/
        /*Es más limpio que un if/else anidado cuando hay varios casos*/
        switch (true) {
            case data.exito:
                alert('¡Gracias por contactarnos! Te responderemos pronto');
                formulario.reset();
                console.log('✅ Formulario enviado correctamente');
                break;
            case respuesta.status === 400:
                alert('Error: ' + data.mensaje);
                break;
            default:
                alert('Ocurrió un error inesperado');
        }

    } catch (error) {
        /*Si no puedo conectar con el backend, lo muestro en consola*/
        /*Esto pasa mientras el backend no esté corriendo*/
        console.error('❌ Error al enviar contacto:', error.message);
        alert('No se pudo conectar con el servidor. Intenta más tarde');
    } finally {
        /*Quito el estado de carga sin importar el resultado*/
        boton.classList.remove('btn-loading');
        boton.textContent = textoOriginal;
    }
};