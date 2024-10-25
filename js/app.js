let DB;

// EVENTOS
window.onload = function() {
    // crear base de dato
    createdb();
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