const db = require('./dbConnection');

class AppController {

    static instanceController;

    constructor() {
        if (!AppController.instanceController) {
            AppController.instanceController = this;
        }
        return AppController.instanceController;
    }

    obtenerPeliculas() {
        const selectPeliculas = 'SELECT titulo, annoPublicacion, duracion, edadRequerida, precioEntrada FROM Pelicula WHERE eliminada = 0 ;';
        return db.query(selectPeliculas);
    }

    obtenerPeliculasCartelera() {
        const selectPeliculas = 'SELECT DISTINCT p.titulo, p.precioEntrada, p.edadRequerida FROM Funcion AS f INNER JOIN Pelicula as p ON p.idPelicula = f.idPelicula;';
        return db.query(selectPeliculas);
    }
}

module.exports = AppController;