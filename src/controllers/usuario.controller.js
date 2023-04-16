const Usuarios = require('../models/usuarios.model');
const mongoose = require('mongoose');

const obtenerUsuarios = (req, res) => {
    Usuarios.find()
    .then(usuarios => res.send(usuarios))
    .catch(err => res.status(500).send({message: err.message || "Error al obtener los usuarios."}));
}

const obtenerUsuarioPorId = (req, res) => {
    const { id } = req.params;

    Usuarios.find({_id: mongoose.Types.ObjectId(id)}, { _id: true, preguntas: false })
        .then(usuario => res.send(usuario))
        .catch(err => res.status(500).send({ message: err.message || "Error al obtener el usuario." }));
}

const crearUsuario = (req, res) => {
    const { nombre, urlImagen } = req.body;

    if (!nombre || !urlImagen) {
        return res.status(400).send({message: "El contenido no puede estar vacío"});
    }

    Usuarios.create({
        nombre,
        urlImagen,
        preguntas: [],
    })
    .then(usuario => res.send(usuario))
    .catch(err => res.status(500).send({message: err.message || "Error al crear el usuario."}));
}

const agregarPreguntaUsuario = (req, res) => {
    const { titulo, idPregunta } = req.body;
    const { idUsuario } = req.params;

    if (!titulo || !idPregunta || !idUsuario) {
        return res.status(400).send({message: "El contenido no puede estar vacío"});
    }

    Usuarios.updateOne(
        {
            _id: mongoose.Types.ObjectId(idUsuario)
        }, 
        {
            $push: {
                preguntas: {
                    id: mongoose.Types.ObjectId(idPregunta),
                    titulo: titulo,
                }
            }
        }
    )
    .then(result => res.send(result))
    .catch(err => res.status(500).send({message: err.message || "Error al agregar la pregunta al usuario."}));
}

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    agregarPreguntaUsuario,
};