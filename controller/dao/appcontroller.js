const db = require('./dbConnection');

class AppController {

    static instanceController;

    constructor() {
        if (!AppController.instanceController) {
            AppController.instanceController = this;
        }
        return AppController.instanceController;
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
}

module.exports = AppController;