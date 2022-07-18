// Selectores
const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

// Eventos
window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
});

// Funciones principales

function buscarClima(e) {
    // Prevenir acción predeterminada
    e.preventDefault();

    // Obtener los valores del formulario
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    // Validar el formulario
    if (ciudad === '' || pais === '') {
        imprimirAlerta('Los dos campos son obligatorios', 'error', 5);
    }

    // Consultar la API
    consultarAPI(ciudad, pais);
}

function consultarAPI(ciudad, pais) {
    // URL de la petición
    const appID = 'cafb01d745a8c30191a779351bbb18bc';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`

    // Mostrar spinner mientras se resuelve la petición
    spinner();

    // Fetch API
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            // Limpiar el HTML previo
            limpiarHTML();

            // Validar que se hayan encontrado datos
            if (datos.cod === '404') {
                imprimirAlerta('Ciudad no encontrada', 'error', 3)
                return;
            }

            // Imprimir la respuesta en HTML
            mostrarClima(datos);
        })
        .catch(error => console.error(error));
}

// Funciones que interactúan con el DOM

function mostrarClima(datos) {
    // Datos que nos interesan (Temperatura actual, máxima y mínima)
    const { name, main: { temp, temp_max, temp_min } } = datos

    // Conversión de grados kelvin a grados centigrados
    const tempCentigrados = kelvinCentigrados(temp);
    const maxCentigrados = kelvinCentigrados(temp_max);
    const minCentigrados = kelvinCentigrados(temp_min);

    // Crear los elemento HTML e imprimirlos
    const pNombre = document.createElement('P');
    pNombre.textContent = `Clima en ${name}`;
    pNombre.classList.add('font-bold', 'text-2xl');

    const pActual = document.createElement('P');
    pActual.innerHTML = `${tempCentigrados} &#8451`;
    pActual.classList.add('font-bold', 'text-6xl');

    const pMaxima = document.createElement('P');
    pMaxima.innerHTML = `Max: ${maxCentigrados} &#8451`;
    pMaxima.classList.add('text-xl');

    const pMinima = document.createElement('P');
    pMinima.innerHTML = `Min: ${minCentigrados} &#8451`;
    pMinima.classList.add('text-xl');

    const divResultado = document.createElement('DIV');
    divResultado.classList.add('text-center', 'text-white');

    divResultado.appendChild(pNombre);
    divResultado.appendChild(pActual);
    divResultado.appendChild(pMaxima);
    divResultado.appendChild(pMinima);
    resultado.appendChild(divResultado);
}

function imprimirAlerta(mensaje, tipo, tiempo) {
    // Eliminar alertas previas
    const alertaPrevia = document.querySelector('.alerta');

    if (alertaPrevia) {
        alertaPrevia.remove();
        return imprimirAlerta(mensaje, tipo, tiempo);
    }

    // Crear el elemento HTML
    const divAlerta = document.createElement('DIV');
    divAlerta.classList.add('px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');
    divAlerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block">${mensaje}</span>
    `;

    // Tipos de alertas
    if (tipo === 'error') {
        divAlerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700',);
    } else {
        divAlerta.classList.add('bg-green-100', 'border-green-400', 'text-green-700',);
    }

    // Imprimir dentro del HTML
    formulario.appendChild(divAlerta);

    // Eliminar la alerta luego de cierto tiempo
    setTimeout(() => divAlerta.remove(), tiempo * 1000);
}

function spinner() {
    // Limpiar el HTML previo
    limpiarHTML();

    // Spinner tomado de https://tobiasahlin.com/spinkit/
    const divSpinner = document.createElement('DIV');
    divSpinner.classList.add('sk-fading-circle')
    divSpinner.innerHTML = `
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    `;

    // Insertar en el HTML
    resultado.appendChild(divSpinner);
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

// Helpers
const kelvinCentigrados = kelvin => parseInt(kelvin - 273.15);