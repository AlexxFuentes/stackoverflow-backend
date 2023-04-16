const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const database = require('./modules/database');
const preguntas = require('./routes/preguntas.routes');
const usuarios = require('./routes/usuarios.routes');

const app = express();

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use(preguntas);
app.use(usuarios);

app.listen(8888, () => {
    console.log('Server on port 8888');
});