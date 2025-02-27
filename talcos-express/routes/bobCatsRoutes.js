const express = require("express");
const router = express.Router();
const bobCatController = require("../controllers/bobCatController");

router.get("/", bobCatController.leerBobCat);
router.post("/", bobCatController.crearBobCat);
router.put("/", bobCatController.actualizarBobCat);
router.put("/eliminarbobcat", bobCatController.eliminarBobCat);

module.exports = router;
