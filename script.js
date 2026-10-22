document.querySelectorAll('.juego').forEach(function (juego) {
    var datos = juego.querySelector('.datos');
    var boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'btn-ficha';
    boton.textContent = 'Ver ficha técnica';
    datos.hidden = true;

    boton.addEventListener('click', function () {
        datos.hidden = !datos.hidden;
        boton.textContent = datos.hidden ? 'Ver ficha técnica' : 'Ocultar ficha técnica';
    });

    juego.querySelector('h3').insertAdjacentElement('afterend', boton);
    boton.insertAdjacentElement('afterend', datos);
});
var tabla = document.getElementById('tabla-juegos');
var filas = tabla.querySelectorAll('tbody tr');

var buscador = document.createElement('input');
buscador.type = 'search';
buscador.id = 'buscador';
buscador.placeholder = 'Buscar juego, año, plataforma o estudio...';
buscador.setAttribute('aria-label', 'Buscar en la tabla de juegos');

var contador = document.createElement('p');
contador.id = 'contador';

tabla.insertAdjacentElement('beforebegin', buscador);
tabla.insertAdjacentElement('beforebegin', contador);

function filtrar() {
    var texto = buscador.value.toLowerCase().trim();
    var visibles = 0;
    filas.forEach(function (fila) {
        var coincide = fila.textContent.toLowerCase().includes(texto);
        fila.hidden = !coincide;
        if (coincide) visibles++;
    });
    contador.textContent = 'Mostrando ' + visibles + ' de ' + filas.length + ' juegos';
}
buscador.addEventListener('input', filtrar);
filtrar();

var form = document.getElementById('form-contacto');
var resultado = document.createElement('p');
resultado.id = 'resultado-form';
resultado.setAttribute('role', 'status');
form.appendChild(resultado);

function mostrarError(campo, mensaje) {
    var aviso = campo.parentElement.querySelector('.error');
    if (!aviso) {
        aviso = document.createElement('span');
        aviso.className = 'error';
        campo.parentElement.appendChild(aviso);
    }
    aviso.textContent = mensaje;
    campo.classList.toggle('invalido', mensaje !== '');
    return mensaje === '';
}

function validar() {
    var nombre = form.nombre;
    var email = form.email;
    var mensaje = form.mensaje;
    var patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var okNombre = mostrarError(nombre,
        nombre.value.trim().length < 3 ? 'El nombre debe tener al menos 3 caracteres.' : '');
    var okEmail = mostrarError(email,
        !patronEmail.test(email.value.trim()) ? 'Ingresá un email válido (ej: nombre@dominio.com).' : '');
    var okMensaje = mostrarError(mensaje,
        mensaje.value.trim().length < 10 ? 'El mensaje debe tener al menos 10 caracteres.' : '');

    return okNombre && okEmail && okMensaje;
}

form.setAttribute('novalidate', '');
form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    resultado.className = '';
    if (validar()) {
        resultado.textContent = 'Mensaje enviado correctamente. ¡Gracias por escribirnos!';
        resultado.className = 'ok';
        form.reset();
    } else {
        resultado.textContent = 'Revisá los campos marcados antes de enviar.';
        resultado.className = 'fallo';
    }
});