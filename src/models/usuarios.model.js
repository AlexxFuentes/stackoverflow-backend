const mongoose = require('mongoose');

const preguntaSquema = new mongoose.Schema({
    id: mongoose.SchemaTypes.ObjectId,
    titulo: String,
});

const esquemaUsuario = new mongoose.Schema({
    nombre: String,
    urlImagen: String,
    preguntas: [preguntaSquema],
});

module.exports = mongoose.model('usuarios', esquemaUsuario);