var portada = document.getElementById('encabezado');
var video = document.getElementById('video-fondo');
if (portada && video) {
    var desvanecer = function () {
        var fade = Math.max(0, 1 - window.scrollY / portada.offsetHeight);
        portada.style.setProperty('--fade', fade);           // el CSS usa esta variable como opacidad del video
        if (fade === 0 && !video.paused) { video.pause(); }   // ya no se ve: pausar
        if (fade > 0 && video.paused) { video.play().catch(function () {}); } // vuelve a verse: reanudar
    };
    window.addEventListener('scroll', desvanecer);
    desvanecer();
}

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
    var nombre = document.getElementById('nombre');
    var email = document.getElementById('email');
    var mensaje = document.getElementById('mensaje');
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

var objetivos = document.querySelectorAll('.juego, .retrato, #monstruos li, main > section:not(#juegos):not(#personajes):not(#monstruos)');
var sinMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !sinMovimiento) {
    var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (!entrada.isIntersecting) { return; }
            var el = entrada.target;
            el.classList.add('visible');                    
            observador.unobserve(el);                      
            setTimeout(function () {                        
                el.classList.remove('reveal', 'visible');
                el.style.transitionDelay = '';
            }, 1000);
        });
    }, { rootMargin: '0px 0px -60px 0px' });
    objetivos.forEach(function (el, i) {
        el.classList.add('reveal');
        el.style.transitionDelay = (i % 3) * 120 + 'ms';   
        observador.observe(el);
    });
}

var imagenes = Array.prototype.slice.call(document.querySelectorAll('main img'));
if (imagenes.length) {
    var actual = 0;
    var caja = document.createElement('div');
    caja.id = 'lightbox';
    caja.hidden = true;                                    
    caja.setAttribute('role', 'dialog');
    caja.setAttribute('aria-modal', 'true');
    caja.setAttribute('aria-label', 'Galería de imágenes');
    caja.innerHTML =
        '<button type="button" class="lb-cerrar" aria-label="Cerrar">✕</button>' +
        '<button type="button" class="lb-prev" aria-label="Imagen anterior">‹</button>' +
        '<figure class="lb-figura"><img class="lb-img" alt=""><figcaption class="lb-texto"></figcaption></figure>' +
        '<button type="button" class="lb-next" aria-label="Imagen siguiente">›</button>';
    document.body.appendChild(caja);
    var lbImg = caja.querySelector('.lb-img');
    var lbTexto = caja.querySelector('.lb-texto');

    var mostrar = function (n) {
        actual = (n + imagenes.length) % imagenes.length;
        lbImg.classList.remove('ampliada');
        lbImg.src = imagenes[actual].src;
        lbImg.alt = imagenes[actual].alt;
        lbTexto.textContent = imagenes[actual].alt + ' (' + (actual + 1) + ' de ' + imagenes.length + ')';
    };
    var abrir = function (n) {
        mostrar(n);
        caja.hidden = false;
        document.body.style.overflow = 'hidden';           
        caja.querySelector('.lb-cerrar').focus();
    };
    var cerrar = function () {
        caja.hidden = true;
        document.body.style.overflow = '';
    };

    imagenes.forEach(function (img, i) {
        img.setAttribute('tabindex', '0');                  
        img.addEventListener('click', function () { abrir(i); });
        img.addEventListener('keydown', function (e) { if (e.key === 'Enter') { abrir(i); } });
    });
    caja.querySelector('.lb-cerrar').addEventListener('click', cerrar);
    caja.querySelector('.lb-prev').addEventListener('click', function () { mostrar(actual - 1); });
    caja.querySelector('.lb-next').addEventListener('click', function () { mostrar(actual + 1); });
    caja.addEventListener('click', function (e) { if (e.target === caja) { cerrar(); } });   // clic en el fondo

    lbImg.addEventListener('click', function (e) {
        if (!lbImg.classList.contains('ampliada')) {
            lbImg.style.transformOrigin = (e.offsetX / lbImg.clientWidth * 100) + '% ' + (e.offsetY / lbImg.clientHeight * 100) + '%';
        }
        lbImg.classList.toggle('ampliada');
    });

    document.addEventListener('keydown', function (e) {
        if (caja.hidden) { return; }
        if (e.key === 'Escape') { cerrar(); }
        if (e.key === 'ArrowLeft') { mostrar(actual - 1); }
        if (e.key === 'ArrowRight') { mostrar(actual + 1); }
    });
}

if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var linterna = document.createElement('div');
    linterna.id = 'linterna';
    document.body.appendChild(linterna);

    var botonLinterna = document.createElement('button');
    botonLinterna.id = 'btn-linterna';
    botonLinterna.type = 'button';
    botonLinterna.textContent = 'Linterna: sí';
    botonLinterna.setAttribute('aria-pressed', 'true');
    document.body.appendChild(botonLinterna);

    var luzX = window.innerWidth / 2, luzY = window.innerHeight * 0.35;       // posición actual de la luz
    var metaX = luzX, metaY = luzY;                                           // hacia dónde va (el mouse)
    var suavidad = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0.18;
    var animandoLuz = false;

    var moverLuz = function () {
        luzX += (metaX - luzX) * suavidad;                                    // se acerca un poco al mouse en cada cuadro
        luzY += (metaY - luzY) * suavidad;
        linterna.style.setProperty('--lx', luzX + 'px');
        linterna.style.setProperty('--ly', luzY + 'px');
        if (Math.abs(metaX - luzX) > 0.5 || Math.abs(metaY - luzY) > 0.5) {
            requestAnimationFrame(moverLuz);                                  // todavía no llegó: sigue animando
        } else {
            animandoLuz = false;                                              // llegó: descansa hasta el próximo movimiento
        }
    };
    document.addEventListener('mousemove', function (e) {
        metaX = e.clientX;
        metaY = e.clientY;
        if (!animandoLuz) { animandoLuz = true; requestAnimationFrame(moverLuz); }
    });
    moverLuz();

    botonLinterna.addEventListener('click', function () {                     // prender / apagar
        linterna.hidden = !linterna.hidden;
        botonLinterna.textContent = linterna.hidden ? 'Linterna: no' : 'Linterna: sí';
        botonLinterna.setAttribute('aria-pressed', String(!linterna.hidden));
    });
}
