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

