// SELECTORES
const menu = document.querySelector('#menu');
const aside = document.querySelector('aside')

// EVENTOS
loadEvents()
function loadEvents() {
    menu.addEventListener('click', handle)
}

// FUNCIONES
function handle(event) {
    event.preventDefault();

    aside.classList.toggle('asideActive');

    if(aside.classList.contains('asideActive')) {
        menu.innerHTML = `<img src="./img/icon-close.svg" alt="icono menu" width="24" height="24">`
    } else {
        menu.innerHTML = `<img src="./img/icon-menu.svg" alt="icono menu" width="24" height="24">`
    }

}

