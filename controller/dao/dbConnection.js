const mysql = require('mysql');

// Para utilizar promesas 
const { promisify } = require('util');

// Importar configuración de la base de datos
const { database } = require('./dataSource');

// Para crear la conexión a la base de datos
const pool = mysql.createPool(database);

// Obtener la conexión, cuando la obtenga puede ocurrir tanto un error como una conexión
pool.getConnection((err, connection) => {
    // Obtenemos un error
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Se perdió la conexión con la base de datos.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.log('La base de datos tiene muchas conexiones.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.log('La conexión con la base de datos fue rechazada.')
        }
    }
    if (connection)
        connection.release();
    console.log("La base de datos está conectada");
    return;
});

// Para permitir el uso de promesas 
pool.query = promisify(pool.query);


// Exportar la conexión
module.exports = pool;