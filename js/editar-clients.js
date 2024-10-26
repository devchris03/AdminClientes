// SELECTORES
const form = document.querySelector('#form');
const nombre = document.querySelector('#nombre');
const email = document.querySelector('#email');
const telefono = document.querySelector('#telefono');
const empresa = document.querySelector('#empresa');

let idCliente;
let DB;

window.onload = function() {
    // abrir la base de datos
    opendb();

    form.addEventListener('submit',  validate);

    // obtengo la url de la pagina actual
    const url = new URLSearchParams(window.location.search);
    idCliente = url.get('id');
}


function opendb() {
    const db = window.indexedDB.open('dbClientes', 1);

    db.onerror = function() {
        console.log('Hubo un error al intentar abrir la base de datos')
    }

    db.onsuccess = function() {
        console.log('Se accedio a la base de datos')

        DB = db.result;

        // vericar si el id existe en la base de datos
        if(idCliente) {
            getCliente(idCliente);
        }
    }
}

function getCliente(id) {
    const transaction = DB.transaction('clientes', 'readwrite');
    const objectStore = transaction.objectStore('clientes');

    const request = objectStore.openCursor();

    request.onerror = function() {
        console.log('Error al acceder a los datos de la base')
    }

    request.onsuccess = function(event) {

        const cursor = event.target.result;
        if(cursor) {
            if(cursor.value.id == id) {
                // mostrar los datos en caso de encontrar coincidencia
                getdata(cursor.value);
            }

            cursor.continue();
        };
    }
}

// mostrar los datos del cliente en el formulario
function getdata(datas) {
    nombre.value = datas.nombre;
    email.value = datas.email;
    telefono.value = datas.telefono;
    empresa.value = datas.empresa;
}

// validar datos de actualización
function validate(event) {
    event.preventDefault();

    if(nombre.value.trim() === '' || email.value.trim() === '' || telefono.value.trim() === '' || empresa.value.trim() === '') {
        return;
    };

    const objCliente = {
        nombre: nombre.value.trim(),
        email: email.value.trim(),
        telefono: telefono.value.trim(),
        empresa: empresa.value.trim(),
        id: Number(idCliente),
    }

    const transaction = DB.transaction('clientes', 'readwrite');
    const objectStore = transaction.objectStore('clientes');

    // actualiza datos
    objectStore.put(objCliente);

    transaction.onerror = function() {
        console.log('error al actualizar');
        alert('error', 'Hubo un problema al actualizar');
    }

    transaction.oncomplete = function() {
        console.log('sisi')
        alert('success', 'Registro actualizado');

        setTimeout(() => {
            window.location.href = "./index.html";
        })
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

