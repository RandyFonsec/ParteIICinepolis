const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');


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
app.get('/', (req, res) => {
    res.render("index.ejs")
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