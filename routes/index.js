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
    router.post("/hapus", kegiatanController.hapus_kegiatan);
    router.post("/kategori", kegiatanController.daftar_kategori_kegiatan);
    router.post("/daftar_semua", kegiatanController.daftar_semua);
    router.post("/daftar_per_pengguna", kegiatanController.daftar_per_pengguna);
    //router.post("/log", kegiatanController.log_kegiatan);
    router.post("/daftar_per_pengguna_porto", kegiatanController.daftar_per_pengguna_porto);
    router.post("/komentar/tambah", kegiatanController.komentar_tambah);
    router.post("/komentar/daftar", kegiatanController.komentar_daftar);
    router.post("/suka", kegiatanController.suka);
    router.post("/suka/daftar", kegiatanController.suka_daftar);
});

module.exports = router;
