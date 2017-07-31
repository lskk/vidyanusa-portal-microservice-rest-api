//Import model
var Absensi = require('../models/absensiModel');

//Import library
var async = require('async');
var moment = require('moment');
var restClient = require('node-rest-client').Client;
var rClient = new restClient();

var base_api_general_url = 'http://apigeneral.vidyanusa.id'

exports.tambah = function(req,res) {

  //Inisial validasi
  req.checkBody('pengguna', 'Id Pengguna diperlukan').notEmpty();
  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('kelas', 'Id kelas diperlukan').notEmpty();
  req.checkBody('keterangan', 'Keteragan diperlukan').notEmpty();
  req.checkBody('latitude', 'Latitude diperlukan').notEmpty();
  req.checkBody('longitude', 'Longitude diperlukan').notEmpty();

  //Dibersihkan dari Special Character
  req.sanitize('pengguna').escape();
  req.sanitize('pengguna').trim();
  req.sanitize('access_token').escape();
  req.sanitize('access_token').trim();
  req.sanitize('kelas').escape();
  req.sanitize('kelas').trim();  
  req.sanitize('keterangan').escape();
  req.sanitize('keterangan').trim();
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

        var inputan = new Absensi(
          {
            pengguna: req.body.pengguna,
            kelas: req.body.kelas,
            tanggal: req.body.tanggal,
            keterangan: req.body.keterangan,
            lokasi: {latitude: req.body.latitude, longitude:req.body.longitude}
          }
        );

        inputan.save(function(err){
          if (err) {
            return res.json({success: false, data: err})
          } else {
            return res.json({success: true, data: {message:'Absensi anda berhasil direkam.'}})
          }
        })

      }else{//sessio tidak berlaku
        return res.json({success: false, data: {message:data.data.message}})
      }
    });


  }

}

exports.daftar_per_pengguna = function(req,res) {
  //Inisial validasi
  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('pengguna', 'Pengguna tidak boleh kosong').notEmpty();

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
              access_token: req.body.access_token},
          	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
           };

    rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {

      if(data.success == true){//session berlaku
        Absensi.find({pengguna:req.body.pengguna})
         .exec(function (err, results) {
           return res.json({success: true, data: results})
         })
      }else{
         return res.json({success: false, data: {message:data.data.message}})
      }

    })

  }

}

exports.daftar_per_kelas = function(req,res) {
  //Inisial validasi
  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('kelas', 'Kelas tidak boleh kosong').notEmpty();

  req.sanitize('access_token').escape();
  req.sanitize('access_token').trim();
  req.sanitize('kelas').escape();
  req.sanitize('kelas').trim();

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
        Absensi.find({kelas:req.body.kelas})
         .exec(function (err, results) {
           return res.json({success: true, data: results})
         })
      }else{
         return res.json({success: false, data: {message:data.data.message}})
      }

    })

  }

}
