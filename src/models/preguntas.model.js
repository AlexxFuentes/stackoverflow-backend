const mongoose = require('mongoose');

const respuestaSquema = new mongoose.Schema({
    descripcion: String,
    fecha: String,
    votos: Number,
    idUsuario: mongoose.SchemaTypes.ObjectId,
});

const esquemaPregunta = new mongoose.Schema({
    titulo: String,
    descripcion: String,
    fecha: String,
    votos: Number,
    vistas: Number,
    hashtags: Array,
    idUsuario: mongoose.SchemaTypes.ObjectId,
    respuestas: [respuestaSquema],
});

module.exports = mongoose.model('preguntas', esquemaPregunta);