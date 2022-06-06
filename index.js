const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

const db = require('./controller/dao/dbConnection');

const AppController = require('./controller/dao/appcontroller');
const controller = new AppController();

// Para compilar en desarrollo: npm run dev

// Configuraciones
app.set('AppName', 'tutorial');
app.set('port', process.env.PORT || 3000);
//  Motor de plantillas
app.set('view engine', 'ejs');


// Sesión
app.set('trust proxy', 1)

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "secret"
}));

// Create application/x-www-form-urlencoded parser  
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Middlewares (Van antes de las rutas)
// Se ejecutan antes de ir a la ruta
// con app.use(function)

//Express ahora entiende json
app.use(express.json());

app.use(express.static('public'));

// Rutas

// ------------- ADMIN
app.get('/', (req, res) => {
    res.render("login.ejs");
});

app.post('/', async(req, res) => {
    var { correo, contrasenna } = req.body;

    if (correo == 'admin' && contrasenna == 'admin') {
        res.redirect('/admin/peliculas');
    } else {
        const result = await controller.validarUsuario(correo, contrasenna);
        if (result.length == 0) {
            const mensaje = 'Correo o contraseña incorrectos';
            res.render('login.ejs', { error: mensaje })
        } else {
            res.redirect('/cliente/cartelera');
        }
    }
});

app.get('/admin/peliculas', async (req, res) => {
    const peliculas = await controller.obtenerPeliculas();
    const directores = await controller.obtenerDirectores();
    const actores = await controller.obtenerActores();
    const generos = await controller.obtenerGeneros();
    const idiomas = await controller.obtenerIdiomas();
    res.render("peliculasAdmin.ejs", { peliculas, directores, actores, generos, idiomas });
});

app.post('/admin/registroPelicula', async (req, res) => {
    const { titulo, director, actor, genero, idioma, annoPublicacion, duracion, edadRequerida, precioEntrada } = req.body;
    const pelicula = { titulo, director, actor, genero, idioma, annoPublicacion, duracion, edadRequerida, precioEntrada };
    await controller.registrarPelicula(pelicula);   
    res.redirect('/admin/peliculas');
});

app.post("/admin/modificarPelicula/:idPelicula", async (req, res) => {
    const { idPelicula } = req.params;
    console.log("idPelicula: " + idPelicula);
    const pelicula = await controller.obtenerPelicula(idPelicula);
    const directores = await controller.obtenerDirectores();
    const actores = await controller.obtenerActores();
    const generos = await controller.obtenerGeneros();
    const idiomas = await controller.obtenerIdiomas();
    res.render("modificarPelicula.ejs", { pelicula : pelicula[0] , directores, actores, generos, idiomas });
});

app.post("/admin/eliminarPelicula/:idPelicula", async(req, res) => {
    let { idPelicula } = req.params;
    await controller.eliminarPelicula(idPelicula);
    res.redirect('/admin/peliculas');
});

app.post('/admin/actualizarPelicula/:idPelicula', async(req, res) => {
    const { idPelicula } = req.params;
    const { titulo, director, actor, genero, idioma, annoPublicacion, duracion, edadRequerida, precioEntrada } = req.body;
    const pelicula = { titulo, director, actor, genero, idioma, annoPublicacion, duracion, edadRequerida, precioEntrada };
    console.log(pelicula);
    console.log(idPelicula);
    await controller.actualizarPelicula(idPelicula, pelicula);
    res.redirect('/admin/peliculas');
});

app.get('/admin/alimentos', (req, res) => {
    res.render("alimentosAdmin.ejs");
});
app.get('/admin/clientes', (req, res) => {
    res.render("clientesAdmin.ejs");
});
app.get('/admin/cartelera', (req, res) => {
    res.render("carteleraAdmin.ejs");
});

// ------------- CLIENTE
app.get('/cliente/cartelera', async(req, res) => {
    const peliculas = await controller.obtenerPeliculasCartelera();
    res.render("carteleraCliente.ejs", { peliculas });
});

app.get('/cliente/cartelera/:id', async(req, res) => {
    const { id } = req.params;
    const peliculas = await controller.obtenerPeliculasCartelera();
    const pelicula = await controller.obtenerPeliculaByID(id);
    console.log(pelicula);
    res.render("carteleraCliente.ejs", { peliculas, pelicula: pelicula[0] });
});


app.get('/cliente/alimentos', async(req, res) => {
    const alimentos = await controller.obtenerAlimentos();
    console.log(alimentos)
    res.render("alimentosCliente.ejs", { alimentos });
});

app.get('/cliente/alimentos/:id', async(req, res) => {
    const { id } = req.params;
    const alimentos = await controller.obtenerAlimentosByTipo(id);
    console.log(alimentos);
    res.render("alimentosCliente.ejs", { alimentos });
});

app.get('/cliente/carrito', (req, res) => {
    res.render("carrito.ejs");
});

app.get('*', (req, res) => {
    res.send("404 ERROR");
});

app.listen(app.get('port'), () => {
    console.log("Servidor Cinépolis escuchando en " + app.get('port'));
});