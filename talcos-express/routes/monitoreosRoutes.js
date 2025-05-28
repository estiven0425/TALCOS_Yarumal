const express = require("express");
const router = express.Router();
const monitoreoController = require("../controllers/monitoreoController");

router.get("/", monitoreoController.leerInforme);

module.exports = router;
