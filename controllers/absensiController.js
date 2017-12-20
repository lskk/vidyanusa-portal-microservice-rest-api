//Import model
var Absensi = require('../models/absensiModel');

//Import Function
const FSession = require('../functions/Session');
const FAbsen = require('../functions/Absensi');

//Import library
var async = require('async');
var moment = require('moment');
var restClient = require('node-rest-client').Client;
var rClient = new restClient();
// var rClient = new restClient({
//  proxy:{
//            host:"",
//            port: ,
//            user:"",
//            password:""
//        }
// });

const Global = require('../global.json');

exports.tambah = function(req,res) {

  //Inisial validasi
  req.checkBody('pengguna', 'Id Pengguna diperlukan').notEmpty();
  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('kelas', 'Id kelas diperlukan').notEmpty();
  req.checkBody('totaldetik', 'Total Detik diperlukan').notEmpty();
  req.checkBody('latitude', 'Latitude diperlukan').notEmpty();
  req.checkBody('longitude', 'Longitude diperlukan').notEmpty();

  //Dibersihkan dari Special Character
  req.sanitize('pengguna').escape();
  req.sanitize('pengguna').trim();
  req.sanitize('access_token').escape();
  req.sanitize('access_token').trim();
  req.sanitize('kelas').escape();
  req.sanitize('kelas').trim();
  req.sanitize('totaldetik').escape();
  req.sanitize('totaldetik').trim();
  req.sanitize('latitude').escape();
  req.sanitize('latitude').trim();
  req.sanitize('longitude').escape();
  req.sanitize('longitude').trim();

  //Menjalankan validasi
  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan
      return res.json({success: false, data: errors})
  }else{
    //Promise session -> tambah absen
    //Promise Cek Session
    const promiseSession =  new Promise(function (resolve, reject) {
      FSession.cek(req.body, function(callback) {
        if(callback.success == true){
            resolve(true)
        }else{
            reject(Global.session.fail)
        }
      });
    });

    //Promise Tambah Absen
    const promiseTambahAbsen =  function(session){
      return new Promise(function (resolve, reject) {
        if(session){
          FAbsen.tambahAbsen(req.body, function(callback) {
            if(callback){
                resolve(Global.tambah_absen.success);
            }else{
              reject(Global.tambah_absen.fail);
            }
          });
        }else{
          reject(Global.tambah_absen.fail)
        }
      })
    };


    //Atur promise
    const consumePromise = function(){
      promiseSession
        .then(promiseTambahAbsen)
        .then(function (data) {
          return res.json({success: true, data: {message:data}})
        })
        .catch(function(error) {
          return res.json({success: false, data: {message:error}})
        })
    };


    //Eksekusi promise
    consumePromise();
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
    //Promise session -> Daftar absensi per pengguna
    //Promise Cek Session
    const promiseSession =  new Promise(function (resolve, reject) {
      FSession.cek(req.body, function(callback) {
        if(callback.success == true){
            resolve(true)
        }else{
            reject(Global.session.fail)
        }
      });
    });

    //Promise Absen Per Pengguna
    var absenPerPengguna
    const promiseAbsenPerPengguna =  function(session){
      return new Promise(function (resolve, reject) {
        if(session){
          FAbsen.absensiPerPengguna(req.body, function(callback) {
            if(arguments[0]){
                absenPerPengguna = arguments[1]
                resolve(true);
            }else{
              reject(Global.absen_pengguna.fail);
            }
          });
        }else{
          reject(Global.absen_pengguna.fail)
        }
      })
    };


    //Atur promise
    const consumePromise = function(){
      promiseSession
        .then(promiseAbsenPerPengguna)
        .then(function () {
          return res.json({success: true, data: absenPerPengguna})
        })
        .catch(function(error) {
          return res.json({success: false, data: {message:error}})
        })
    };


    //Eksekusi promise
    consumePromise();

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
    //Promise Pengguna -> Absen per kelas
    //Promise Cek Session
    const promiseSession =  new Promise(function (resolve, reject) {
      FSession.cek(req.body, function(callback) {
        if(callback.success == true){
            resolve(true)
        }else{
            reject(Global.session.fail)
        }
      });
    });

    //Promise Absen Per Kelas
    var absenPerKelas
    const promiseAbsenPerPengguna =  function(session){
      return new Promise(function (resolve, reject) {
        if(session){
          FAbsen.absensiPerKelas(req.body, function(callback) {
            if(arguments[0]){
                absenPerKelas = arguments[1]
                resolve(true);
            }else{
              reject(Global.absen_perkelas.fail);
            }
          });
        }else{
          reject(Global.absen_perkelas.fail)
        }
      })
    };

    //Atur promise
    const consumePromise = function(){
      promiseSession
        .then(promiseAbsenPerPengguna)
        .then(function () {
          return res.json({success: true, data: absenPerKelas})
        })
        .catch(function(error) {
          return res.json({success: false, data: {message:error}})
        })
    };

    //Eksekusi promise
    consumePromise();
  }
}
