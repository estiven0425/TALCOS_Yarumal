const express = require("express");
const router = express.Router();
const registroApController = require("../controllers/registroApController");

router.get("/", registroApController.leerRegistroAp);
router.post("/", registroApController.crearRegistroAp);
router.put("/", registroApController.actualizarRegistroAp);
router.put("/eliminarregistroap", registroApController.eliminarRegistrosAp);

module.exports = router;
