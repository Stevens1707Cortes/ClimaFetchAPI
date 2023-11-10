
// Variables

const container = document.querySelector('#container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

//EventListeners

window.addEventListener('load', ()=>{
    formulario.addEventListener('submit', buscarClima)
})

// Funciones

function buscarClima(e) {
    e.preventDefault();

    // Validar

    const ciudad = document.querySelector('#ciudad');
    const pais = document.querySelector('#pais');


    if (ciudad.value === '' || pais.value === '') {
        // mostrar error
        mostrarAlerta('No pueden existir campos vacios');

        return;
    }else{
        console.log('Buscando clima');
    }

    // Consultar API

    consultarAPI(ciudad.value, pais.value);


}

function consultarAPI(ciudad, pais) {

    const appID = 'd741eae2fb88ab1a72ec8ecbee4fe991';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}&lang=es`;

    spinner();

    fetch(url)
        .then( resultado => {
            return resultado.json();
        })

        .then( datos => {
            // Limipiar el HTML
            limpiarHTML();

            console.log(datos);
            if (datos.cod === '404') {
                mostrarAlerta('Ciudad no encontrada');
                return;
            }

            // Mostrar en el HTML

            climaHTML(datos);
            
        })
        
}

function climaHTML(datos) {

    const {name, main:{temp, temp_max, temp_min } } = datos;

    const contenedor = document.createElement('div');
    contenedor.className = 'text-center text-white';

    const nombre = document.createElement('p');
    nombre.textContent = `Clima en ${name}`;
    nombre.classList.add('font-bold','text-2xl')

    const temperatura = document.createElement('p');
    temperatura.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    temperatura.classList.add('font-bold', 'text-6xl');

    const maxima= document.createElement('p');
    maxima.textContent = `Max: ${(temp_max - 273.15).toFixed(1)}°C`;
    maxima.classList.add('text-xl');

    const minima = document.createElement('p');
    minima.textContent = `Min: ${(temp_min - 273.15).toFixed(1)}°C`;
    minima.classList.add('text-xl');

    contenedor.appendChild(nombre);
    contenedor.appendChild(temperatura);
    contenedor.appendChild(maxima);
    contenedor.appendChild(minima);
    resultado.appendChild(contenedor);


    formulario.reset();
}

function limpiarHTML(){
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function spinner() {
    limpiarHTML();
    
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    divSpinner.innerHTML = `
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
    `;

    resultado.appendChild(divSpinner);
}

function mostrarAlerta(mensaje) {
    const limpiarAlerta = formulario.querySelector('.alerta');

    if (!limpiarAlerta) {
        // Crear Alerta
        const alerta = document.createElement('div');
        alerta.className = 'alerta bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto mt-6 text-center';
        
        const strong = document.createElement('strong');
        strong.classList.add('font-bold');
        strong.textContent = 'Error';

        const span = document.createElement('span');
        span.classList.add('block');
        span.textContent = mensaje;

        alerta.appendChild(strong);
        alerta.appendChild(span);
        formulario.appendChild(alerta);

        // Se elimine despues de 3 segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
    
}
