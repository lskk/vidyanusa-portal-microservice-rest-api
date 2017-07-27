var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
require('express-group-routes');

var absensiController = require('../controllers/absensiController');
var kegiatanController = require('../controllers/kegiatanController');

router.group("/absensi", (router) => {
    router.post("/daftar_per_pengguna", absensiController.daftar_per_pengguna);
    router.post("/daftar_per_kelas", absensiController.daftar_per_kelas);
    router.post("/tambah", absensiController.tambah);
});

router.group("/kegiatan", (router) => {
    router.post("/", kegiatanController.tambah_kegiatan);
    router.post("/kategori", kegiatanController.daftar_kategori_kegiatan);
    router.post("/daftar_semua", kegiatanController.daftar_semua);
    router.post("/daftar_per_pengguna", kegiatanController.daftar_per_pengguna);
});

module.exports = router;
