const express = require('express');
const router = express.Router();
const { obtenerUsuarios, crearUsuario, agregarPreguntaUsuario, obtenerUsuarioPorId } = require('../controllers/usuario.controller');

router.get('/usuarios', obtenerUsuarios);

router.get('/usuarios/:id', obtenerUsuarioPorId);

router.post('/usuarios', crearUsuario);

router.post('/usuarios/:idUsuario', agregarPreguntaUsuario);

module.exports = router;