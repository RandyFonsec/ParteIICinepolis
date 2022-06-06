const db = require('./dbConnection');

class AppController {

    static instanceController;

    constructor() {
        if (!AppController.instanceController) {
            AppController.instanceController = this;
        }
        return AppController.instanceController;
    }
    validarUsuario(correo, contra) {
        const selectUsuario = 'SELECT * FROM Cliente WHERE correoElectronico = ? AND contrasenna = ? ;';
        return db.query(selectUsuario, [correo, contra]);
    }

    obtenerPeliculaByID(id) {
        const selectPeliculas = 'SELECT idPelicula, titulo, annoPublicacion, duracion, edadRequerida, precioEntrada FROM Pelicula WHERE idPelicula = ?;';
        return db.query(selectPeliculas, [id]);
    }

    obtenerPeliculasCartelera() {
        const selectPeliculas = 'SELECT DISTINCT p.titulo, p.precioEntrada, p.edadRequerida, p.idPelicula FROM Funcion AS f INNER JOIN Pelicula as p ON p.idPelicula = f.idPelicula;';
        return db.query(selectPeliculas);
    }

    obtenerAlimentos() {
        const selectAlimentos = 'SELECT * FROM Alimento';
        return db.query(selectAlimentos);
    }

    obtenerAlimentosByTipo(tipo) {
        const selectAlimentos = 'SELECT * FROM Alimento WHERE idTipoAlimento =?';
        return db.query(selectAlimentos, [tipo]);
    }
}

module.exports = AppController;