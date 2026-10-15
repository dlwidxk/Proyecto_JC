/* LÓGICA DEL PANEL DE ADMINISTRACIÓN */
/* Este archivo se carga en admin/index.html y admin/dashboard.html */

/* CONFIGURACIÓN DEL ADMINISTRADOR */
const ADMIN_CONFIG = {
    apiUrl: 'http://localhost:2323/api'
};

/* CLAVES DEL LOCALSTORAGE */
const STORAGE_KEYS = {
    logueado: 'adminLogueado',
    nombre: 'adminNombre',
    token: 'adminToken'
};

/* INICIAR CUANDO EL HTML ESTÉ CARGADO */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Iniciando panel de administración...');

    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        iniciarLogin(loginForm);
        return;
    }

    const adminContainer = document.querySelector('.admin-container');

    if (adminContainer) {
        iniciarDashboard();
    }
});

/* LOGIN */
const iniciarLogin = (loginForm) => {
    Object.values(STORAGE_KEYS).forEach(clave => {
        localStorage.removeItem(clave);
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const credenciales = {
            usuario: document.getElementById('usuario').value.trim(),
            password: document.getElementById('password').value
        };

        const errorMsg = document.getElementById('login-error');

        errorMsg.style.display = 'none';
        errorMsg.textContent = '';

        if (!credenciales.usuario || !credenciales.password) {
            mostrarErrorLogin(
                errorMsg,
                'Por favor completa todos los campos'
            );
            return;
        }

        const resultado = await intentarLogin(credenciales);

        if (resultado.exito) {
            guardarSesion(resultado.nombre, resultado.token);
            window.location.href = 'dashboard.html';
        } else {
            mostrarErrorLogin(errorMsg, resultado.mensaje);
        }
    });
};

/* COMUNICACIÓN CON EL BACKEND PARA INICIAR SESIÓN */
const intentarLogin = async (credenciales) => {
    try {
        const respuesta = await fetch(
            `${ADMIN_CONFIG.apiUrl}/admin/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credenciales)
            }
        );

        const data = await respuesta.json();

        if (!respuesta.ok || !data.exito || !data.token) {
            return {
                exito: false,
                mensaje: data.mensaje || 'No se pudo iniciar sesión'
            };
        }

        return {
            exito: true,
            nombre: data.nombre,
            token: data.token
        };

    } catch (error) {
        console.error('Error al conectar con el backend:', error);

        return {
            exito: false,
            mensaje: 'No se pudo conectar con el servidor. Comprueba que esté iniciado.'
        };
    }
};

/* GUARDAR SESIÓN */
const guardarSesion = (nombre, token) => {
    localStorage.setItem(STORAGE_KEYS.logueado, 'true');
    localStorage.setItem(STORAGE_KEYS.nombre, nombre);
    localStorage.setItem(STORAGE_KEYS.token, token);

    console.log(`Sesión guardada para ${nombre}`);
};

/* MOSTRAR ERRORES DEL LOGIN */
const mostrarErrorLogin = (elemento, mensaje) => {
    elemento.textContent = mensaje;
    elemento.style.display = 'block';
};

/* INICIAR DASHBOARD */
const iniciarDashboard = () => {
    const logueado = localStorage.getItem(STORAGE_KEYS.logueado);
    const token = localStorage.getItem(STORAGE_KEYS.token);

    if (logueado !== 'true' || !token) {
        cerrarSesion();
        return;
    }

    const nombreAdmin = localStorage.getItem(STORAGE_KEYS.nombre) || 'Admin';
    const welcomeMessage = document.getElementById('welcome-message');

    if (welcomeMessage) {
        welcomeMessage.textContent = `Bienvenida, ${nombreAdmin}`;
    }

    const btnLogout = document.getElementById('btn-logout');

    if (btnLogout) {
        btnLogout.addEventListener('click', cerrarSesion);
    }

    cargarAlumnos();
    cargarMensajes();

    const btnRecargarAlumnos = document.getElementById('btn-recargar-alumnos');

    if (btnRecargarAlumnos) {
        btnRecargarAlumnos.addEventListener('click', cargarAlumnos);
    }

    const btnRecargarMensajes = document.getElementById('btn-recargar-mensajes');

    if (btnRecargarMensajes) {
        btnRecargarMensajes.addEventListener('click', cargarMensajes);
    }
};

/* CERRAR SESIÓN */
const cerrarSesion = () => {
    Object.values(STORAGE_KEYS).forEach(clave => {
        localStorage.removeItem(clave);
    });

    console.log('Sesión cerrada');
    window.location.href = 'index.html';
};

/* CONSULTAR ALUMNOS DESDE EL BACKEND */
const cargarAlumnos = async () => {
    const tabla = document.getElementById('tabla-alumnos');

    if (!tabla) return;

    tabla.innerHTML = '<tr><td colspan="5">Cargando alumnos...</td></tr>';

    try {
        const token = localStorage.getItem(STORAGE_KEYS.token);

        const respuesta = await fetch(
            `${ADMIN_CONFIG.apiUrl}/admin/alumnos`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await respuesta.json();

        if (respuesta.status === 401 || respuesta.status === 403) {
            cerrarSesion();
            return;
        }

        if (!respuesta.ok || !data.exito) {
            tabla.innerHTML = '<tr><td colspan="5">Error al cargar alumnos</td></tr>';
            return;
        }

        actualizarEstadistica('total-alumnos', data.total);

        if (!Array.isArray(data.alumnos) || data.alumnos.length === 0) {
            tabla.innerHTML = '<tr><td colspan="5">No hay alumnos registrados aún</td></tr>';
            return;
        }

        tabla.innerHTML = data.alumnos.map(crearFilaAlumno).join('');

    } catch (error) {
        console.error('Error al cargar alumnos:', error);
        tabla.innerHTML = '<tr><td colspan="5">No se pudo conectar con el servidor</td></tr>';
    }
};

/* CREAR FILA DE ALUMNO */
const crearFilaAlumno = (alumno) => {
    const colorEstado = alumno.estado === 'Activo'
        ? 'var(--nw-success)'
        : 'var(--nw-danger)';

    const materias = Array.isArray(alumno.materias) && alumno.materias.length > 0
        ? alumno.materias.join(', ')
        : 'Sin asignar';

    return `
        <tr>
            <td data-label="Nombre">${alumno.nombre || ''}</td>
            <td data-label="Email">${alumno.email || ''}</td>
            <td data-label="Nivel">${alumno.nivel || ''}</td>
            <td data-label="Materias">${materias}</td>
            <td data-label="Estado" style="color: ${colorEstado}; font-weight: bold;">
                ${alumno.estado || 'Sin estado'}
            </td>
        </tr>
    `;
};

/* CONSULTAR MENSAJES DE CONTACTO */
const cargarMensajes = async () => {
    const tabla = document.getElementById('tabla-mensajes');

    if (!tabla) return;

    tabla.innerHTML = '<tr><td colspan="5">Cargando mensajes...</td></tr>';

    try {
        const token = localStorage.getItem(STORAGE_KEYS.token);

        const respuesta = await fetch(
            `${ADMIN_CONFIG.apiUrl}/contacto`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await respuesta.json();

        if (respuesta.status === 401 || respuesta.status === 403) {
            cerrarSesion();
            return;
        }

        if (!respuesta.ok || !data.exito) {
            tabla.innerHTML = '<tr><td colspan="5">Error al cargar mensajes</td></tr>';
            return;
        }

        actualizarEstadistica('total-mensajes', data.total);

        const mensajes = Array.isArray(data.mensajes) ? data.mensajes : [];
        const sinLeer = mensajes.filter(mensaje => !mensaje.leido).length;

        actualizarEstadistica('total-sin-leer', sinLeer);

        if (mensajes.length === 0) {
            tabla.innerHTML = '<tr><td colspan="5">No hay mensajes aún</td></tr>';
            return;
        }

        tabla.innerHTML = mensajes.map(crearFilaMensaje).join('');

    } catch (error) {
        console.error('Error al cargar mensajes:', error);
        tabla.innerHTML = '<tr><td colspan="5">No se pudo conectar con el servidor</td></tr>';
    }
};

/* CREAR FILA DE MENSAJE */
const crearFilaMensaje = (mensaje) => {
    const fecha = mensaje.fechaEnvio
        ? new Date(mensaje.fechaEnvio).toLocaleDateString('es-EC', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
        : 'Sin fecha';

    const textoMensaje = mensaje.mensaje || '';
    const mensajeCorto = textoMensaje.length > 60
        ? textoMensaje.substring(0, 60) + '...'
        : textoMensaje;

    return `
        <tr>
            <td data-label="Nombre">${mensaje.nombre || ''}</td>
            <td data-label="Email">${mensaje.email || ''}</td>
            <td data-label="Nivel">${mensaje.nivel || 'No especificado'}</td>
            <td data-label="Mensaje">${mensajeCorto}</td>
            <td data-label="Fecha">${fecha}</td>
        </tr>
    `;
};

/* ACTUALIZAR ESTADÍSTICAS */
const actualizarEstadistica = (id, valor) => {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
};