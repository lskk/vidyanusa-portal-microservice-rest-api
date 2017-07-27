//Import model
var Kegiatan = require('../models/kegiatanModel');
var KategoriKegiatan = require('../models/kategoriKegiatanModel');

//Import library
var async = require('async');
var moment = require('moment');
var restClient = require('node-rest-client').Client;
var rClient = new restClient();

var base_api_general_url = 'http://apigeneral.vidyanusa.id'

exports.tambah_kegiatan = function(req,res) {

  //Inisial validasi
  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('judul', 'Mohon isi field Judul').notEmpty();
  req.checkBody('kategori', 'Mohon pilih Kategori').notEmpty();
  req.checkBody('pengguna', 'Mohon isi field Pengguna').notEmpty();
  req.checkBody('file_berkas', 'Mohon pilih berkas foto').notEmpty();
  req.checkBody('latitude', 'Mohon izinkan web browser untuk mengetahui lokasi anda sekarang.').notEmpty();
  req.checkBody('longitude', 'Mohon izinkan web browser untuk mengetahui lokasi anda sekarang.').notEmpty();

  //Dibersihkan dari Special Character
  req.sanitize('access_token').escape();
  req.sanitize('access_token').trim();
  req.sanitize('judul').escape();
  req.sanitize('judul').trim();
  req.sanitize('pengguna').escape();
  req.sanitize('pengguna').trim();
  req.sanitize('kategori').escape();
  req.sanitize('kategori').trim();
  req.sanitize('file_berkas').escape();
  req.sanitize('file_berkas').trim();
  req.sanitize('latitude').escape();
  req.sanitize('latitude').trim();
  req.sanitize('longitude').escape();
  req.sanitize('longitude').trim();

  //Menjalankan validasi
  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan

      return res.json({success: false, data: errors})

  }else{

    //Cek akses token terlebih dahulu
    args = {
          	data: {
              access_token: req.body.access_token},
          	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
           };

    rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {
      if(data.success == true){//session berlaku

        var inputan = new Kegiatan(
          {
            judul: req.body.judul,
            pengguna: req.body.pengguna,
            kategori: req.body.kategori,
            file_berkas: req.body.file_berkas,
            lokasi: {latitude: req.body.latitude, longitude:req.body.longitude}
          }
        );

        inputan.save(function(err){
          if (err) {
            return res.json({success: false, data: err})
          } else {
            return res.json({success: false, data: {message:'Kegiatan anda berhasil di tambahkan.'}})
          }
        })

      }else{//sessio tidak berlaku
        return res.json({success: false, data: {message:data.data.message}})
      }
    });


  }

}

exports.daftar_kategori_kegiatan = function(req,res) {
  //Inisial validasi
  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.sanitize('access_token').escape();
  req.sanitize('access_token').trim();

  //Menjalankan validasi
  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan

    return res.json({success: false, data: {message: errors }})

  }else{

    //Cek akses token terlebih dahulu
    args = {
          	data: {
              access_token: req.body.access_token},
          	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
           };

    rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {

      if(data.success == true){//session berlaku
        KategoriKegiatan.find({}).select({nama_kategori:1})
         .exec(function (err, results) {
           return res.json({success: true, data: results})
         })
      }else{
         return res.json({success: false, data: {message:data.data.message }})
      }

    })

  }

}
