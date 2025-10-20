const express = require("express");
const registroApController = require("../controllers/registroApController");

const router = express.Router();

router.get("/", registroApController.leerRegistroAp);
router.post("/", registroApController.crearRegistroAp);
router.put("/", registroApController.actualizarRegistroAp);
router.put("/eliminarregistroap", registroApController.eliminarRegistrosAp);

module.exports = router;
