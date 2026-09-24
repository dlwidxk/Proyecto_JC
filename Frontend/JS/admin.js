/*Aquí va toda la lógica del panel de administración*/
/*Este archivo se carga en admin/index.html y admin/dashboard.html*/
/*Detecto en qué página estoy y ejecuto lo que corresponda*/

/*CONFIGURACIÓN DEL ADMIN*/
/*Objeto con todos los datos del panel*/
const ADMIN_CONFIG = {
    apiUrl: 'http://localhost:2323/api',
    usuarioPrueba: 'admin',
    passwordPrueba: 'formulaexacta2026',
    nombrePrueba: 'Directora',
    tokenPrueba: 'token-de-prueba-local'
};

/*CLAVES DEL LOCALSTORAGE*/
/*Las pongo en un objeto para no escribirlas mal en algún lado*/
const STORAGE_KEYS = {
    logueado: 'adminLogueado',
    nombre: 'adminNombre',
    token: 'adminToken'
};


/*Espero a que el HTML esté cargado*/
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Iniciando panel de administración...');

    /*Detecto en qué página estoy*/
    /*Si el formulario de login existe, estoy en el login*/
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        iniciarLogin(loginForm);
        return;
    }

    /*Si el contenedor del admin existe, estoy en el dashboard*/
    const adminContainer = document.querySelector('.admin-container');
    if (adminContainer) {
        iniciarDashboard();
    }
});


/*FUNCIÓN PARA EL LOGIN*/
const iniciarLogin = (loginForm) => {
    /*Limpio cualquier sesión vieja por si el admin llegó aquí por error*/
    /*Uso Object.values para recorrer los valores del objeto de claves*/
    Object.values(STORAGE_KEYS).forEach(clave => {
        localStorage.removeItem(clave);
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        /*Recojo lo que escribió el admin en un objeto*/
        const credenciales = {
            usuario: document.getElementById('usuario').value.trim(),
            password: document.getElementById('password').value.trim()
        };

        const errorMsg = document.getElementById('login-error');
        errorMsg.style.display = 'none';
        errorMsg.textContent = '';

        /*Valido que no estén vacíos antes de hacer la petición*/
        if (!credenciales.usuario || !credenciales.password) {
            mostrarErrorLogin(errorMsg, 'Por favor completa todos los campos');
            return;
        }

        /*Intento hacer login en el backend*/
        const resultado = await intentarLogin(credenciales);
        
        if (resultado.exito) {
            /*Guardo la sesión y me voy al dashboard*/
            guardarSesion(resultado.nombre, resultado.token);
            window.location.href = 'dashboard.html';
        } else {
            mostrarErrorLogin(errorMsg, resultado.mensaje);
        }
    });
};


/*FUNCIÓN QUE INTENTA HACER LOGIN EN EL BACKEND*/
/*Si el backend no está disponible, usa las credenciales de prueba*/
const intentarLogin = async (credenciales) => {
    try {
        /*Hago la petición al backend*/
        const respuesta = await fetch(`${ADMIN_CONFIG.apiUrl}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credenciales)
        });

        const data = await respuesta.json();

        /*Si el backend dice que es exitoso, devuelvo los datos*/
        if (data.exito) {
            return { 
                exito: true, 
                nombre: data.usuario.nombre, 
                token: data.token 
            };
        }

        /*Si el backend dice que falló, devuelvo el mensaje*/
        return { exito: false, mensaje: data.mensaje };

    } catch (error) {
        /*Si el backend no está corriendo, uso las credenciales de prueba*/
        console.warn('⚠️ Backend no disponible, usando credenciales locales');
        
        /*Comparo las credenciales con las de prueba*/
        const esValido = credenciales.usuario === ADMIN_CONFIG.usuarioPrueba 
            && credenciales.password === ADMIN_CONFIG.passwordPrueba;

        if (esValido) {
            return { 
                exito: true, 
                nombre: ADMIN_CONFIG.nombrePrueba, 
                token: ADMIN_CONFIG.tokenPrueba 
            };
        }

        return { exito: false, mensaje: 'Usuario o contraseña incorrectos' };
    }
};


/*FUNCIÓN QUE GUARDA LA SESIÓN EN LOCALSTORAGE*/
const guardarSesion = (nombre, token) => {
    localStorage.setItem(STORAGE_KEYS.logueado, 'true');
    localStorage.setItem(STORAGE_KEYS.nombre, nombre);
    localStorage.setItem(STORAGE_KEYS.token, token);
    console.log(`✅ Sesión guardada para ${nombre}`);
};


/*FUNCIÓN QUE MUESTRA UN ERROR EN EL LOGIN*/
const mostrarErrorLogin = (elemento, mensaje) => {
    elemento.textContent = mensaje;
    elemento.style.display = 'block';
};


/*FUNCIÓN PARA EL DASHBOARD*/
const iniciarDashboard = () => {
    /*Reviso que el admin esté logueado*/
    const logueado = localStorage.getItem(STORAGE_KEYS.logueado);
    
    /*Si no está logueado, lo mando al login*/
    if (logueado !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    /*Muestro el nombre del admin en el header*/
    const nombreAdmin = localStorage.getItem(STORAGE_KEYS.nombre) || 'Admin';
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Bienvenida, ${nombreAdmin}`;
    }

    /*Manejo el botón de cerrar sesión*/
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', cerrarSesion);
    }

    /*Cargo los datos del dashboard*/
    cargarAlumnos();
    cargarMensajes();

    /*Botones de recarga manual*/
    const btnRecargarAlumnos = document.getElementById('btn-recargar-alumnos');
    if (btnRecargarAlumnos) {
        btnRecargarAlumnos.addEventListener('click', cargarAlumnos);
    }

    const btnRecargarMensajes = document.getElementById('btn-recargar-mensajes');
    if (btnRecargarMensajes) {
        btnRecargarMensajes.addEventListener('click', cargarMensajes);
    }
};


/*FUNCIÓN QUE CIERRA LA SESIÓN*/
const cerrarSesion = () => {
    /*Recorro todas las claves y las elimino una por una*/
    Object.values(STORAGE_KEYS).forEach(clave => {
        localStorage.removeItem(clave);
    });
    console.log('👋 Sesión cerrada');
    window.location.href = 'index.html';
};


/*FUNCIÓN QUE TRAE LOS ALUMNOS DESDE EL BACKEND*/
const cargarAlumnos = async () => {
    const tabla = document.getElementById('tabla-alumnos');
    if (!tabla) return;

    tabla.innerHTML = '<tr><td colspan="5">Cargando alumnos...</td></tr>';

    try {
        const respuesta = await fetch(`${ADMIN_CONFIG.apiUrl}/admin/alumnos`);
        const data = await respuesta.json();

        if (!data.exito) {
            tabla.innerHTML = '<tr><td colspan="5">Error al cargar alumnos</td></tr>';
            return;
        }

        /*Actualizo la tarjeta de estadísticas con el total*/
        actualizarEstadistica('total-alumnos', data.total);

        /*Si no hay alumnos, aviso*/
        if (data.alumnos.length === 0) {
            tabla.innerHTML = '<tr><td colspan="5">No hay alumnos registrados aún</td></tr>';
            return;
        }

        /*Genero las filas con map y las uno con join*/
        tabla.innerHTML = data.alumnos.map(crearFilaAlumno).join('');

    } catch (error) {
        console.warn('⚠️ Backend no disponible, mostrando datos de prueba');
        mostrarAlumnosDePrueba();
    }
};


/*FUNCIÓN QUE CREA UNA FILA HTML PARA UN ALUMNO*/
/*La saco aparte para que el map quede más limpio*/
const crearFilaAlumno = (alumno) => {
    /*Uso un ternario para el color del estado*/
    const colorEstado = alumno.estado === 'Activo' 
        ? 'var(--nw-success)' 
        : 'var(--nw-danger)';

    /*Si el alumno no tiene materias, muestro "Sin asignar"*/
    /*Uso el operador ternario y el método join*/
    const materias = alumno.materias && alumno.materias.length > 0 
        ? alumno.materias.join(', ') 
        : 'Sin asignar';

    /*Uso template literals para construir la fila*/
    return `
        <tr>
            <td data-label="Nombre">${alumno.nombre}</td>
            <td data-label="Email">${alumno.email}</td>
            <td data-label="Nivel">${alumno.nivel}</td>
            <td data-label="Materias">${materias}</td>
            <td data-label="Estado" style="color: ${colorEstado}; font-weight: bold;">${alumno.estado}</td>
        </tr>
    `;
};


/*FUNCIÓN QUE TRAE LOS MENSAJES DE CONTACTO*/
const cargarMensajes = async () => {
    const tabla = document.getElementById('tabla-mensajes');
    if (!tabla) return;

    tabla.innerHTML = '<tr><td colspan="5">Cargando mensajes...</td></tr>';

    try {
        const respuesta = await fetch(`${ADMIN_CONFIG.apiUrl}/contacto`);
        const data = await respuesta.json();

        if (!data.exito) {
            tabla.innerHTML = '<tr><td colspan="5">Error al cargar mensajes</td></tr>';
            return;
        }

        /*Actualizo las tarjetas de estadísticas*/
        actualizarEstadistica('total-mensajes', data.total);

        /*Cuento cuántos mensajes no han sido leídos*/
        /*Uso filter para quedarme solo con los que tienen leido=false*/
        /*Y luego .length para contar cuántos quedaron*/
        const sinLeer = data.mensajes.filter(m => !m.leido).length;
        actualizarEstadistica('total-sin-leer', sinLeer);

        if (data.mensajes.length === 0) {
            tabla.innerHTML = '<tr><td colspan="5">No hay mensajes aún</td></tr>';
            return;
        }

        tabla.innerHTML = data.mensajes.map(crearFilaMensaje).join('');

    } catch (error) {
        console.warn('⚠️ Backend no disponible, mostrando datos de prueba');
        mostrarMensajesDePrueba();
    }
};


/*FUNCIÓN QUE CREA UNA FILA HTML PARA UN MENSAJE*/
const crearFilaMensaje = (mensaje) => {
    /*Formateo la fecha para que se vea bonita*/
    const fecha = new Date(mensaje.fechaEnvio).toLocaleDateString('es-EC', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    /*Corto el mensaje si es muy largo*/
    /*Uso un ternario para decidir si cortarlo o no*/
    const mensajeCorto = mensaje.mensaje.length > 60 
        ? mensaje.mensaje.substring(0, 60) + '...' 
        : mensaje.mensaje;

    return `
        <tr>
            <td data-label="Nombre">${mensaje.nombre}</td>
            <td data-label="Email">${mensaje.email}</td>
            <td data-label="Nivel">${mensaje.nivel || 'No especificado'}</td>
            <td data-label="Mensaje">${mensajeCorto}</td>
            <td data-label="Fecha">${fecha}</td>
        </tr>
    `;
};


/*FUNCIÓN QUE ACTUALIZA UNA TARJETA DE ESTADÍSTICA*/
const actualizarEstadistica = (id, valor) => {
    const elemento = document.getElementById(id);
    /*Si el elemento existe, actualizo su texto*/
    if (elemento) {
        elemento.textContent = valor;
    }
};


/*DATOS DE PRUEBA POR SI EL BACKEND NO ESTÁ CORRIENDO*/
/*Esto es solo para que veas el diseño mientras desarrollo*/
const mostrarAlumnosDePrueba = () => {
    const tabla = document.getElementById('tabla-alumnos');
    if (!tabla) return;

    /*Arreglo con objetos de prueba*/
    const alumnosPrueba = [
        { nombre: 'Ana García', email: 'ana@test.com', nivel: '12-14', materias: ['Matemáticas', 'Física'], estado: 'Activo' },
        { nombre: 'Luis Pérez', email: 'luis@test.com', nivel: '15-17', materias: ['Cálculo'], estado: 'Activo' },
        { nombre: 'Sofía Martínez', email: 'sofia@test.com', nivel: '15-17', materias: ['Física'], estado: 'Inactivo' }
    ];

    /*Uso map y join para generar las filas*/
    tabla.innerHTML = alumnosPrueba.map(crearFilaAlumno).join('');
    actualizarEstadistica('total-alumnos', alumnosPrueba.length);
};


const mostrarMensajesDePrueba = () => {
    const tabla = document.getElementById('tabla-mensajes');
    if (!tabla) return;

    const mensajesPrueba = [
        { nombre: 'Victor', email: 'victor@test.com', nivel: '15-17', mensaje: 'Quiero información sobre el curso de Cálculo', fechaEnvio: new Date(), leido: false },
        { nombre: 'María', email: 'maria@test.com', nivel: '12-14', mensaje: '¿Cuánto cuesta el plan mensual?', fechaEnvio: new Date(), leido: true }
    ];

    tabla.innerHTML = mensajesPrueba.map(crearFilaMensaje).join('');
    actualizarEstadistica('total-mensajes', mensajesPrueba.length);
    
    /*Cuento cuántos no han sido leídos*/
    const sinLeer = mensajesPrueba.filter(m => !m.leido).length;
    actualizarEstadistica('total-sin-leer', sinLeer);
};