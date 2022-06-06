const db = require ('./dbConnection');

class AppController {

    static instanceController;

    constructor() {
        if (!AppController.instanceController) {
            AppController.instanceController = this;
        }
        return AppController.instanceController;
    }
    
    obtenerPeliculas () {
        const selectPeliculas = 'SELECT titulo, annoPublicacion, duracion, edadRequerida, precioEntrada FROM Pelicula WHERE eliminada = 0 ;';
        return db.query (selectPeliculas);
    }

}

module.exports = AppController;