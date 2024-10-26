let DB;

// SELECTORES
const form = document.querySelector('#form');

// EVENTOS
loadEvents();
function loadEvents() {
    form.addEventListener('submit', validate);

    opendb();
}

// FUNCIONES
// valida formulario
function validate(event) {
    event.preventDefault();

    const nombre = form.querySelector('#nombre').value;
    const email = form.querySelector('#email').value;
    const telefono = form.querySelector('#telefono').value;
    const empresa = form.querySelector('#empresa').value;

    if(nombre.trim() === '' || email.trim() === '' || telefono.trim() === '' || empresa.trim() === '') {
        return;
    }

    const objCliente = {
        nombre,
        email,
        telefono,
        empresa,
        id: Date.now(),
    }

    // agregar cliente
    addCliente(objCliente);
}

// abre la base de datos
function opendb() {
    const db = window.indexedDB.open('dbClientes', 1);

    // verifica error
    db.onerror = function() {
        console.log('problemas al intentar abrir la base de datos')
    }

    // verifica existo
    db.onsuccess = function(event) {
        console.log('se abrio correctamente');

        DB = event.target.result;
    }
}


function addCliente(objCliente) {

    const transaction = DB.transaction('clientes', 'readwrite');

    const objectStore = transaction.objectStore('clientes');

    objectStore.add(objCliente);

    transaction.onerror = function() {
        alert('error', 'Ups, hubo error al agregar cliente.')
    }
    
    transaction.oncomplete = function() {
        alert('success', 'Se agregó correctamente');
        form.reset();
    }

}


function alert(type, message) {
    const alert = document.createElement('P');
    alert.classList.add('alert')

    alert.textContent = message;

    if(type === 'error') {
        alert.classList.add('error')
    } else {
        alert.classList.add('success')
    }

    form.parentElement.insertBefore(alert, form);

    setTimeout(() => {
        alert.remove();
    }, 3000)

}



