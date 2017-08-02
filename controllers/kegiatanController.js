//Import model
var Kegiatan = require('../models/kegiatanModel');
var Log = require('../models/logModel');
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
  req.checkBody('username', 'Mohon isi field Username').notEmpty();
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
  req.sanitize('username').escape();
  req.sanitize('username').trim();

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

        //Mengatur proses
        async.series({
              one: function(callback) {
                //Menambahkan ke collection kegiatan
                var inputan = new Kegiatan(
                  {
                    judul: req.body.judul,
                    pengguna: req.body.pengguna,
                    username: req.body.username,
                    kategori: req.body.kategori,
                    file_berkas: req.body.file_berkas,
                    lokasi: {latitude: req.body.latitude, longitude:req.body.longitude}
                  }
                );

                inputan.save(function(err){
                  if (err) {
                    console.log('Terjadi error di input kegiatan')
                    //return res.json({success: false, data: err})
                  } else {
                    console.log('Input kegiatan berhasil')
                    //return res.json({success: true, data: {message:'Kegiatan anda berhasil di tambahkan.'}})
                  }
                })

                callback(null, 1);
              },
              two: function(callback){
                //Menambahkan poin
                args = {
                      	data: {
                          access_token: req.body.access_token,
                          jumlah_poin: 1,
                          keterangan: 'poin didapatkan dari menambahkan kegiatan',
                          id_pengguna: req.body.pengguna
                        },
                      	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                       };

                rClient.post(base_api_general_url+'/poin/tambah', args, function (data, response) {
                  if(data.success == true){//poin berhasil ditambahkan
                    console.log('Poin berhasil ditambahkan')
                  }else{
                    console.log('Poin gagal ditambahkan')
                  }
                })

                callback(null, 2);
              }
          }, function(err, results) {
              // results is now equal to: {one: 1, two: 2}
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
         return res.json({success: false, data: {message:data.data.message}})
      }

    })

  }

}

exports.daftar_semua = function(req,res) {
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
              access_token: req.body.access_token
            },
          	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
           };

    rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {

      if(data.success == true){//session berlaku

        Kegiatan.find({})
         .sort([['created_at', 'descending']])
         .populate('kategori')
         .exec(function (err, results) {
           return res.json({success: true, data: results})
         })

      }else{
         return res.json({success: false, data: {message:data.data.message}})
      }

    })

  }

}

exports.daftar_per_pengguna = function(req,res) {
  //Inisial validasi
  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('pengguna', 'Id pengguna tidak boleh kosong').notEmpty();

  req.sanitize('access_token').escape();
  req.sanitize('access_token').trim();
  req.sanitize('pengguna').escape();
  req.sanitize('pengguna').trim();

  //Menjalankan validasi
  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan

    return res.json({success: false, data: {message: errors }})

  }else{

    //Cek akses token terlebih dahulu
    args = {
          	data: {
              access_token: req.body.access_token,
              pengguna: req.body.pengguna
            },
          	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
           };

    rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {

      if(data.success == true){//session berlaku
        Kegiatan.find({pengguna:req.body.pengguna})
         .exec(function (err, results) {
           return res.json({success: true, data: results})
         })
      }else{
         return res.json({success: false, data: {message:data.data.message}})
      }

    })

  }

}

exports.log_kegiatan = function(req,res) {

  if(req.body.id_pengguna == null || req.body.id_pengguna == ''){
    return res.json({success: false, data: {message:'Param id pengguna tidak boleh kosong.'}})
  }else{

    Log.find({'pengguna':req.body.id_pengguna})
     .sort([['created_at', 'descending']])
     .exec(function (err, results) {
       return res.json({success: true, data: results})
     })

  }


}
