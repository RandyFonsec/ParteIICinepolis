const res = require('express/lib/response');
const db = require ('./dbConnection');

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
    
    obtenerPeliculas () {
        const selectPeliculas = 'SELECT idPelicula, titulo, annoPublicacion, duracion, edadRequerida, precioEntrada FROM Pelicula WHERE eliminada = 0 ;';
        return db.query (selectPeliculas);
    }

    obtenerDirectores () {
        const selectDirector = 'SELECT idDirector, concat(nombre, " " , apellido) as nombre FROM Director ;';
        return db.query (selectDirector);
    }

    obtenerActores () {
        const selectActor = 'SELECT idActor, concat(nombre, " " ,apellido) as nombre FROM Actor ;';
        return db.query (selectActor);
    }

    obtenerGeneros () {
        const selectGenero = 'SELECT idGenero, nombreGenero FROM Genero ;';
        return db.query (selectGenero);
    }

    obtenerIdiomas () {
        const selectIdioma = 'SELECT idIdioma, nombreIdioma FROM Idioma ;';
        return db.query (selectIdioma);
    }

    registrarPelicula (pelicula) {
        const insertPelicula = 'INSERT INTO Pelicula (titulo, annoPublicacion, duracion, edadRequerida, precioEntrada, eliminada, idDirector) VALUES (?, ?, ?, ?, ?, 0, ?);';
        db.query ( insertPelicula, [pelicula.titulo, pelicula.annoPublicacion, pelicula.duracion, pelicula.edadRequerida, pelicula.precioEntrada, pelicula.director], function(err, result) {
            if (err) {
                console.log(err);
            } else {
                const idPelicula = result.insertId;
                console.log(result)
                const asociarGeneroPelicula = 'INSERT INTO GeneroXPelicula (idPelicula, idGenero) VALUES (?, ?);';
                db.query(asociarGeneroPelicula, [idPelicula, pelicula.genero], function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        const asociarActorPelicula = 'INSERT INTO ActorXPelicula (idPelicula, idActor) VALUES (?, ?);';
                        db.query(asociarActorPelicula, [idPelicula, pelicula.actor], function(err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                const asociarIdiomaPelicula = 'INSERT INTO IdiomaXPelicula (idPelicula, idIdioma) VALUES (?, ?);';
                                db.query(asociarIdiomaPelicula, [idPelicula, pelicula.idioma], function(err, result) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('Pelicula registrada exitosamente');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    };

    obtenerPelicula (idPelicula) {
        const selectPelicula = 'SELECT idPelicula, titulo, annoPublicacion, duracion, edadRequerida, precioEntrada, eliminada FROM Pelicula WHERE idPelicula = ? AND eliminada = 0;';
        return db.query (selectPelicula, [idPelicula]);
    }

    actualizarPelicula (idPelicula, pelicula) {
        const updatePelicula = 'UPDATE Pelicula SET titulo = ?, annoPublicacion = ?, duracion = ?, edadRequerida = ?, precioEntrada = ?, idDirector = ? WHERE idPelicula = ?;';
        db.query(updatePelicula, [pelicula.titulo, pelicula.annoPublicacion, pelicula.duracion, pelicula.edadRequerida, pelicula.precioEntrada, pelicula.director, idPelicula], function(err, result) {
            if (err) {
                console.log(err);
            } else {
                const actualizarGeneroPelicula = 'UPDATE GeneroXPelicula SET idGenero = ? WHERE idPelicula = ?;';
                db.query(actualizarGeneroPelicula, [pelicula.genero, idPelicula], function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        const actualizarActorPelicula = 'UPDATE ActorXPelicula SET idActor = ? WHERE idPelicula = ?;';
                        db.query(actualizarActorPelicula, [pelicula.actor, idPelicula], function(err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                const actualizarIdiomaPelicula = 'UPDATE IdiomaXPelicula SET idIdioma = ? WHERE idPelicula = ?;';
                                db.query(actualizarIdiomaPelicula, [pelicula.idioma, idPelicula], function(err, result) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('Pelicula actualizada exitosamente');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    };

    eliminarPelicula (idPelicula) {
        const deletePelicula = 'UPDATE Pelicula SET eliminada = 1 WHERE idPelicula = ?;';
        db.query(deletePelicula, [idPelicula], function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('Pelicula eliminada exitosamente');
            }
        });
    };


/*
    async registrarPelicula (pelicula) {
        console.log(pelicula);
        const insertPelicula = 'INSERT INTO Pelicula (titulo, annoPublicacion, duracion, edadRequerida, precioEntrada, eliminada, idDirector) VALUES (?, ?, ?, ?, ?, 0, ?);';
        const result = await db.query(insertPelicula, [pelicula.titulo, pelicula.annoPublicacion, pelicula.duracion, pelicula.edadRequerida, pelicula.precioEntrada, pelicula.director]);
        console.log(result);
        const asociarGeneroPelicula = 'INSERT INTO GeneroXPelicula (idPelicula, idGenero) VALUES (?, ?);';
        await db.query(asociarGeneroPelicula, [result.insertId, pelicula.genero]);
        const asociarActorPelicula = 'INSERT INTO ActorXPelicula (idPelicula, idActor) VALUES (?, ?);';
        await db.query(asociarActorPelicula, [result.insertId, pelicula.actor]);
        const asociarIdiomaPelicula = 'INSERT INTO IdiomaXPelicula (idPelicula, idIdioma) VALUES (?, ?);';
        await db.query(asociarIdiomaPelicula, [result.insertId, pelicula.idioma]);
    };*/
    
}

module.exports = AppController;