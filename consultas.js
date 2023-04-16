
usuarios = {
    _id: ObjectId(),
    nombre: String,
    urlImagen: String,
    preguntas: [{ id: String, titulo: string }]
}

preguntas = {
    _id: ObjectId(),
    idUsuario: string,
    titulo: String,
    descripcion: String,
    fecha: Date,
    votos: Number,
    vistas: Number,
    hashtags: [String]
}

//Funciona
db.usuarios.aggregate([
    {
        $lookup: {
            from: "preguntas",
            localField: "preguntas.titulo",
            foreignField: "titulo",
            as: "preguntas"
        }
    }
]);

//funciona -> usar esta
db.usuarios.aggregate([
    {
        $lookup: {
            from: "preguntas",
            localField: "_id",
            foreignField: "idUsuario",
            as: "preguntas"
        }
    }
]);


//Funciona
db.preguntas.aggregate([
    {
        $match: { _id: ObjectId("642212f567b5545738b005c0") }
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



db.preguntas.aggregate([
    {
        $match: { _id: ObjectId("642212f567b5545738b005c0") }
    },
    {
        $lookup: {
            from: "usuarios",
            localField: "idUsuario",
            foreignField: "_id",
            as: "usuario"
        }
    },
    {
        $unwind: "$respuestas"
    },
    {
        $lookup: {
            from: "usuarios",
            localField: "respuestas.idUsuario",
            foreignField: "_id",
            as: "respuestas.usuario"
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
            usuario: {
                $arrayElemAt: ["$usuario", 0]
            },
            "respuestas.descripcion": 1,
            "respuestas.fecha": 1,
            "respuestas.votos": 1,
            "respuestas.idUsuario": 1,
            "respuestas.usuario": {
                $arrayElemAt: ["$respuestas.usuario", 0]
            }
        }
    }
])
