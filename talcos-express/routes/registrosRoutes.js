const express = require("express");
const router = express.Router();
const registroController = require("../controllers/registroController");

router.get("/", registroController.leerRegistro);
router.post("/", registroController.crearRegistro);
router.post("/importarregistro", registroController.importarRegistro);
router.put("/", registroController.actualizarRegistro);
router.put("/eliminarregistro", registroController.eliminarRegistros);

module.exports = router;
