var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
require('express-group-routes');

var kegiatanController = require('../controllers/kegiatanController');


router.group("/kegiatan", (router) => {
    router.post("/", kegiatanController.tambah_kegiatan);
    router.post("/kategori", kegiatanController.daftar_kategori_kegiatan);
});

module.exports = router;
