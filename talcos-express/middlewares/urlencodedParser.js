const express = require('express');
const urlencodedParser = express.urlencoded({ extended: false });

module.exports = urlencodedParser;
