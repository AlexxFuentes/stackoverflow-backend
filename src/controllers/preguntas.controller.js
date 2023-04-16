const Preguntas = require('../models/preguntas.model.js');
const mongoose = require('mongoose');

const actualizarVotosRespuesta = (req, res) => {
    const { id } = req.params;
    const { voto } = req.body;
    Preguntas.updateOne({ "respuestas._id": mongoose.Types.ObjectId(id) }, { $inc: { "respuestas.$.votos": voto } })
    .then(pregunta => res.send(pregunta))
    .catch(err => res.status(500).send({message: err.message || "Error al obtener la pregunta."}));
}

const actualizarVotosPregunta = (req, res) => {
    const { id } = req.params;
    const { voto } = req.body;
    Preguntas.updateOne({_id: mongoose.Types.ObjectId(id)}, { $inc: { votos: voto } })
    .then(pregunta => res.send(pregunta))
    .catch(err => res.status(500).send({message: err.message || "Error al obtener la pregunta."}));
}

//Funciona
const obtenerPreguntasPorId = (req, res) => {
    const { id } = req.params;
    Preguntas.aggregate([
        {
            $match: { _id: mongoose.Types.ObjectId(id) }
        },
        {
            $lookup: {
                from: "usuarios",
                localField: "respuestas.idUsuario",
                foreignField: "_id",
                as: "respuestasUsuario"
            }
        },
        {
            $project: {
                _id: 1,
                titulo: 1,
                descripcion: 1,
                fecha: 1,
                votos: 1,
                vistas: 1,
                hashtags: 1,
                idUsuario: 1,
                respuestas: {
                    $map: {
                        input: "$respuestas",
                        as: "respuesta",
                        in: {
                            _id: "$$respuesta._id",
                            descripcion: "$$respuesta.descripcion",
                            fecha: "$$respuesta.fecha",
                            votos: "$$respuesta.votos",
                            idUsuario: "$$respuesta.idUsuario",
                            nombre: { $arrayElemAt: ["$respuestasUsuario.nombre", { $indexOfArray: ["$respuestasUsuario._id", "$$respuesta.idUsuario"] }] },
                            urlImagen: { $arrayElemAt: ["$respuestasUsuario.urlImagen", { $indexOfArray: ["$respuestasUsuario._id", "$$respuesta.idUsuario"] }] }
                        }
                    }
                }
            }
        }
    ])
    .then(preguntas => res.send(preguntas))
    .catch(err => res.status(500).send({message: err.message || "Error al obtener las preguntas."}));
}

//funciona
const obtenerPreguntasUsuario = (req, res) => {
    Preguntas.aggregate([
        {
            $lookup: {
                from: "usuarios",
                localField: "idUsuario",
                foreignField: "_id",
                as: "usuario"
            }
        },
        {
            $project: {
                _id: 1,
                hashtags: 1,
                titulo: 1,
                descripcion: 1,
                fecha: 1,
                votos: 1,
                vistas: 1,
                respuestas: 1,
                usuario: {
                    _id: 1,
                    nombre: 1,
                    urlImagen: 1,
                }
            }
        }
    ])
    .then(preguntas => res.send(preguntas))
    .catch(err => res.status(500).send({message: err.message || "Error al obtener las preguntas."}));
}

//Funciona
const crearPregunta = (req, res) => {
    const { titulo, descripcion, hashtags, idUsuario } = req.body;

    if (!titulo || !descripcion || !hashtags || !idUsuario) {
        return res.status(400).send({message: "El contenido no puede estar vacío"});
    }

    Preguntas.create({
        titulo,
        descripcion,
        fecha: getFechaActual(),
        votos: 0,
        vistas: 0,
        hashtags: hashtags,
        idUsuario: mongoose.Types.ObjectId(idUsuario),
        respuestas: [],
    }).then(pregunta => res.send(pregunta))
    .catch(err => res.status(500).send({message: err.message || "Error al crear la pregunta."}));
}

//Funciona
const agregarRespuestaPregunta = (req, res) => {
    const { idpregunta } = req.params;
    const { descripcion, idusuario } = req.body;

    if (!idusuario || !descripcion || !idpregunta) {
        return res.status(400).send({message: "El contenido no puede estar vacío"});
    }

    Preguntas.updateOne(
        {
            _id: mongoose.Types.ObjectId(idpregunta)
        },
        {
            $push: {
                respuestas: {
                    _id: mongoose.Types.ObjectId(),
                    descripcion: descripcion,
                    votos: 0,
                    fecha: getFechaActual(),
                    idUsuario: mongoose.Types.ObjectId(idusuario),
                }
            }
        }
    )
    .then(result => res.send(result))
    .catch(err => res.status(500).send({message: err.message || "Error al agregar la pregunta al usuario."}));
}

//Funciona
function getFechaActual() {
    const fechaActual = new Date();
    const anio = fechaActual.getFullYear();
    const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
    const dia = String(fechaActual.getDate()).padStart(2, "0");
    const fechaFormateada = `${anio}-${mes}-${dia}`;
    return fechaFormateada;
}

module.exports = {
    crearPregunta,
    obtenerPreguntasUsuario,
    agregarRespuestaPregunta,
    obtenerPreguntasPorId,
    actualizarVotosPregunta,
    actualizarVotosRespuesta,
};
