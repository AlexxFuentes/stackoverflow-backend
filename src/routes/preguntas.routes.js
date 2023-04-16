const express = require('express');
const router = express.Router();
const { crearPregunta, obtenerPreguntasUsuario, agregarRespuestaPregunta, obtenerPreguntasPorId, actualizarVotosPregunta, actualizarVotosRespuesta } = require('../controllers/preguntas.controller');

router.get('/preguntas/usuarios', obtenerPreguntasUsuario);

router.get('/pregunta/:id', obtenerPreguntasPorId);

router.post('/preguntas', crearPregunta);

router.post('/preguntas/respuestas/:idpregunta', agregarRespuestaPregunta);

router.post('/preguntas/votos/:id', actualizarVotosPregunta);

router.post('/preguntas/respuestas/votos/:id', actualizarVotosRespuesta);

module.exports = router;