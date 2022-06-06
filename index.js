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

    if (nombreUsuario == 'admin' && contrasenna == 'admin') {
        res.redirect('/admin/peliculas');
    } else {
        const result = await controller.validarUsuario(nombreUsuario, contrasenna);
        if (result.length == 0) {
            const mensaje = 'Correo o contraseña incorrectos';
            res.render('login.ejs', { error: mensaje })
        } else {
            res.redirect('/cliente/cartelera');
        }
    }
    res.render("login.ejs");
});
app.get('/admin/peliculas', async(req, res) => {
    const peliculas = await controller.obtenerPeliculas();
    res.render("peliculasAdmin.ejs", { peliculas });
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

    res.render("carteleraCliente.ejs", { peliculas, pelicula });
});


app.get('/cliente/alimentos', async(req, res) => {
    const alimentos = await controller.obtenerAlimentos();
    console.log(alimentos[0])
    res.render("alimentosCliente.ejs", { alimentos });
});

app.get('/cliente/alimentos/:id', async(req, res) => {
    const alimentos = await controller.obtenerAlimentos();
    console.log(alimentos);
    res.render("alimentosCliente.ejs", { alimentos });
});

app.get('/cliente/carrito', (req, res) => {
    res.render("carrito.ejs");
});


/*Rutas
app.use('/admin', routesAdmin);
*/

app.get('*', (req, res) => {
    res.send("404 ERROR");
});

app.listen(app.get('port'), () => {
    console.log("Servidor Cinépolis escuchando en " + app.get('port'));
});