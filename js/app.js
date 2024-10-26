let DB;
const list = document.querySelector('#list')

// EVENTOS
window.onload = function() {
    // crear base de dato
    createdb();

    list.addEventListener('click', deleteCliente);
}

// FUNCIONES
function createdb() {
    let crearedb = window.indexedDB.open('dbClientes', 1);

    // verificar error
    crearedb.onerror = function() {
        console.log('Problemas al crear la base de datos')
    }

    // verifica éxito 
    crearedb.onsuccess = function(event) {
        console.log('Base de datos creada con éxito');

        DB = event.target.result;

        // muestra lista de clientes
        showClientes();
    }

    // configura schema
    crearedb.onupgradeneeded = function(event) {
        // referencia de la base de datos
        const db = event.target.result;

        // creacion del almacen de objecto o comunmente llamado "tabla"
        const objectStore = db.createObjectStore('clientes', {keyPath: 'id'});

        // creación de index o comunmente conocido como columnas
        objectStore.createIndex('nombre', 'nombre', {unique: false});
        objectStore.createIndex('email', 'email', {unique: true});
        objectStore.createIndex('telefono', 'telefono', {unique: false});
        objectStore.createIndex('empresa', 'empresa', {unique: true});
        objectStore.createIndex('id', 'id', {unique: true});
    }
}

function showClientes() {
    const objectStore = DB.transaction('clientes', 'readwrite').objectStore('clientes')
    
    // mostrar cantidad de clientes
    const quantity = objectStore.count();
    quantity.onerror = function() {
        console.log('Hubo un error al mostar cantidad de clientes')
    }
    quantity.onsuccess = function(event) {
        const total = event.target.result; 

        const result = document.querySelector('#result');

        // inserta en el html
        total > 0 ? result.textContent = `Existen ${total} clientes.` : result.textContent ='No hay clientes'
    }

    // obtiene los datos de la base
    const cursor = objectStore.openCursor();

    cursor.onerror = function() {
        console.log('Hubo un error al obtener clientes')
    }
    
    cursor.onsuccess = function(event) {
        const cursor = event.target.result;

        if(cursor) {
            const {nombre, email, telefono, empresa, id} = cursor.value;

            // crea fila de la tabla
            const item = document.createElement('TR');
            item.innerHTML = `
                <td>
                    <p class="nameCliente">${nombre}</p>
                    <p>${email}</p>
                </td>
                <td>${telefono}</td>
                <td>${empresa}</td>
                <td>
                    <a href="./editar-cliente.html?id=${id}" aria-label="editar cliente" class="buttonAction edit">Editar</a>
                    <a href="#" data-cliente="${id}" aria-label="eliminar cliente" class="buttonAction delete">Eliminar</a>
                </td>
                `;

            // muestra el siguiente registro
            cursor.continue();

            // inserta en el html
            list.appendChild(item);
        }
    }
}

// elimina cliente
function deleteCliente(event) {

    if(event.target.classList.contains('delete')) {

        const idDelete = Number(event.target.dataset.cliente);

        const confirm = window.confirm('¿Estas seguro de querer eliminar este registro?');

        if(confirm) {
            const transaction = DB.transaction('clientes', 'readwrite');
            const objectStore = transaction.objectStore('clientes');

            objectStore.delete(idDelete);

            transaction.onerror = function() {
                alert('error', 'Error al intentar eliminar registro.');
            }

            transaction.oncomplete = function() {
                alert('success', 'Registro eliminado.')

                // elimina registro del html
                event.target.closest('tr').remove();
            }
        }   
    }
}

// muestra alerta
function alert(type, message) {
    const alert = document.createElement('P');
    alert.classList.add('alert')

    alert.textContent = message;

    if(type === 'error') {
        alert.classList.add('error')
    } else {
        alert.classList.add('success')
    }

    document.querySelector('.containerTable').parentElement.insertBefore(alert, document.querySelector('.containerTable'));

    setTimeout(() => {
        alert.remove();
    }, 3000)

}