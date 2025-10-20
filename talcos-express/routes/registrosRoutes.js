const express = require("express");
const registroController = require("../controllers/registroController");

const router = express.Router();

router.get("/", registroController.leerRegistro);
router.post("/", registroController.crearRegistro);
router.post("/importarregistro", registroController.importarRegistro);
router.put("/", registroController.actualizarRegistro);
router.put("/eliminarregistro", registroController.eliminarRegistros);

module.exports = router;
