const express = require("express");
const monitoreoController = require("../controllers/monitoreoController");

const router = express.Router();

router.get("/", monitoreoController.leerInforme);

module.exports = router;
