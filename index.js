const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

const db = require('./controller/dao/dbConnection');


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
app.get('/admin/peliculas', (req, res) => {
    res.render("peliculasAdmin.ejs");
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
app.get('/cliente/cartelera', (req, res) => {
    res.render("carteleraCliente.ejs", { listaPeliculasm, listam });
});



app.get('/cliente/Alimentos', (req, res) => {
    res.render("alimentosCliente.ejs");
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