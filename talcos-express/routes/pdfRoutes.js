const { generarPDF } = require("../controllers/pdfController");

const express = require("express");

const router = express.Router();

router.post("/", generarPDF);

module.exports = router;
