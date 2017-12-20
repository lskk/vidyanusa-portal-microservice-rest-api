//Import model
const Kegiatan = require('../models/kegiatanModel');
const Log = require('../models/logModel');
const KategoriKegiatan = require('../models/kategoriKegiatanModel');
const Pengguna = require('../models/penggunaModel');

//Import Function
const FSession = require('../functions/Session');
const FKegiatan = require('../functions/Kegiatan');
const FLog = require('../functions/Log');
const FPoin = require('../functions/Poin');

//Import library
const async = require('async');
const moment = require('moment');
const restClient = require('node-rest-client').Client;
const rClient = new restClient();
// var rClient = new restClient({
//  proxy:{
//            host:"",
//            port: ,
//            user:"",
//            password:""
//        }
// });
const mongoose = require('mongoose');

const Global = require('../global.json');

exports.tambah_kegiatan = function(req,res) {
  //Inisial validasi
  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('judul', 'Mohon isi field Judul').notEmpty();
  req.checkBody('kategori', 'Mohon pilih Kategori').notEmpty();
  req.checkBody('pengguna', 'Mohon isi field Pengguna').notEmpty();
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
  req.sanitize('latitude').escape();
  req.sanitize('latitude').trim();
  req.sanitize('longitude').escape();
  req.sanitize('longitude').trim();

  //Menjalankan validasi
  var errors = req.validationErrors();

  if(errors){//Kesalahan validasi
      return res.json({success: false, data: errors})
  }else{
      //Membuat promise cek session->tambah kegiatan->tambah poin->tambah log
      //Promise Cek Session
      const promiseSession =  new Promise(function (resolve, reject) {
        FSession.cek(req.body, function(callback) {
          //console.log("session callback: "+callback.success)
          if(callback.success == true){
              resolve(true)
          }else{
              reject(Global.session.fail)
          }
        });
      });

      //Promise Tambah Kegiatan
      const promiseKegiatan =  function(session){
        return new Promise(function (resolve, reject) {
          if(session){
            FKegiatan.tambahKegiatan(req.body, function(callback) {
              if(callback == true){
                //console.log("Masuk ke resolve true kegiatan")
                  resolve(true);
              }else{
                reject(Global.tambah_kegiatan.fail);
              }
            });
          }else{
            reject(Global.tambah_kegiatan.fail)
          }
        })
      };

      //Promise Tambah Poin
      const promisePoin =  function(kegiatan){
        return new Promise(function (resolve, reject) {
          if(kegiatan){
            FPoin.tambahPoin(req.body, function(callback) {
              if(callback.success == true){
                  resolve(true);
              }else{
                reject(Global.tambah_poin.fail);
              }
            });
          }else{
            reject(Global.tambah_poin.fail)
          }
        })
      };

      //Promise Tambah Log
      const promiseLog =  function(poin){
        return new Promise(function (resolve, reject) {
          if(poin){
            FLog.tambahKegiatanLog(req.body, function(callback) {
              if(callback.success == true){
                  resolve(true);
              }else{
                reject(Global.tambah_log.fail);
              }
            });
          }else{
            reject(Global.tambah_log.fail)
          }
        })
      };

      //Atur Promise
      const consumePromise = function(){
        promiseSession
          .then(promiseKegiatan)
          .then(promisePoin)
          .then(promiseLog)
          .then(function () {
            return res.json({success: true, data: {message:Global.tambah_kegiatan.success}})
          })
          .catch(function(error) {
            return res.json({success: false, data: {message:error}})
          })
      };

      //Eksekusi Promise
      consumePromise();
  }
}

exports.komentar_tambah = function(req,res) {

  //Inisial validasi
  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('pengguna', 'Mohon isi id pengguna').notEmpty();
  req.checkBody('kegiatan', 'Mohon isi id kegiatan').notEmpty();
  req.checkBody('komentar', 'Mohon isi id komentar').notEmpty();

  //Dibersihkan dari Special Character
  req.sanitize('access_token').escape();
  req.sanitize('access_token').trim();

  req.sanitize('pengguna').escape();
  req.sanitize('pengguna').trim();

  req.sanitize('kegiatan').escape();
  req.sanitize('kegiatan').trim();

  req.sanitize('komentar').escape();
  req.sanitize('komentar').trim();

  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan
      return res.json({success: false, data: errors})
  }else{
    //Membuat promise cek session->tambah komentar pada kegiatan->tambah poin->tambah log
    //Promise Cek Session
    const promiseSession =  new Promise(function (resolve, reject) {
      FSession.cek(req.body, function(callback) {
        if(callback.success){
            resolve(true)
        }else{
            reject(Global.session.fail)
        }
      });
    });

    //Promise Tambah Komentar pada Kegiatan
    const promiseKomentar = function(session){
      return new Promise(function(resolve, reject){
        if(session){
          FKegiatan.tambahKomentar(req.body, function(callback){
            if(callback){
              resolve(true)
            }else{
              reject(Global.tambah_komentar.fail);
            }
          })
          resolve(true);
        }else{
          reject(Global.tambah_komentar.fail);
        }
      })
    };

    //Promise tambah poin
    const promisePoin = function(komentar){
      return new Promise(function(resolve, project){
        if(komentar){
          FPoin.tambahPoin(req.body, function(callback){
            if(callback.success == true){
                resolve(true);
            }else{
              reject(Global.tambah_poin.fail);
            }
          })
        }else{
          reject(Global.tambah_poin.fail);
        }
      })
    };

    //Promise tambah Log
    const promiseLog = function(poin){
      return new Promise(function(resolve, reject){
        if(poin){
          FLog.tambahKomentarLog(req.body, function(callback) {
            if(callback.success == true){
                resolve(true);
            }else{
              reject(Global.tambah_log.fail);
            }
          });
        }else{
          reject(Global.tambah_log.fail)
        }
      })
    };

    //Atur promise
    const consumePromise = function(){
      promiseSession
        .then(promiseKomentar)
        .then(promisePoin)
        .then(promiseLog)
        .then(function(){
          return res.json({success: true, data: {message:Global.tambah_komentar.success}});
        })
        .catch(function(error){
          return res.json({success: false, data: {message:error}});
        })
    };

    //Eksekusi promise
    consumePromise();
  }
}

exports.komentar_daftar = function(req,res) {

  //Inisial validasi
  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('kegiatan', 'Mohon isi id kegiatan').notEmpty();

  //Dibersihkan dari Special Character
  req.sanitize('access_token').escape();
  req.sanitize('access_token').trim();

  req.sanitize('kegiatan').escape();
  req.sanitize('kegiatan').trim();

  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan
      return res.json({success: false, data: errors})
  }else{

    //Membuat promise cek session->daftar komentar
    //Promise Session
    const promiseSession =  new Promise(function (resolve, reject) {
      FSession.cek(req.body, function(callback) {
        if(callback.success){
            resolve(true)
        }else{
            reject(Global.session.fail)
        }
      });
    });

    //Promise Daftar komentar
    var daftarKomentar;
    const promiseKomentar = function(session){
      return new Promise(function(resolve, reject){
        if(session){
          FKegiatan.daftarKomentarKegiatan(req.body, function(callback){
            if(callback){
              daftarKomentar = arguments[1];
              resolve(callback);
            }else{
              reject(Global.daftar_komentar.fail);
            }
          })
        }else{
          reject(Global.daftar_komentar.fail)
        }
      })
    }

    //Atur promise
    const consumePromise = function(){
      promiseSession
        .then(promiseKomentar)
        .then(function(){
          return res.json({success: true, data: daftarKomentar})
        })
        .catch(function(error){
          return res.json({success: false, data: {message:Global.daftar_komentar.fail}})
        })
    }

    //Eksekusi promiseSession
    consumePromise();
  }
}

exports.suka = function(req,res){
  //Inisial validasi
  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('pengguna', 'Mohon isi id pengguna').notEmpty();
  req.checkBody('kegiatan', 'Mohon isi id kegiatan').notEmpty();

  //Dibersihkan dari Special Character
  req.sanitize('access_token').escape();
  req.sanitize('access_token').trim();

  req.sanitize('pengguna').escape();
  req.sanitize('pengguna').trim();

  req.sanitize('kegiatan').escape();
  req.sanitize('kegiatan').trim();

  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan
      return res.json({success: false, data: errors})
  }else{
    //Promise cek session -> mencek terlebih dahulu sudah menlike atau belum kl sudah status likenya disesuaikan -> menambahkan log
    //Promise Session
    const promiseSession =  new Promise(function (resolve, reject) {
      FSession.cek(req.body, function(callback) {
        if(callback.success){
            resolve(true)
        }else{
            reject(Global.session.fail)
        }
      });
    });

    //Promise Like
    var statusLike;
    const promiseLike =  function(session){
      return new Promise(function (resolve, reject) {
        if(session){
          FKegiatan.sukaiKegiatan(req.body, function(callback) {
            if(arguments[0]){

                statusLike = arguments[1]
                resolve(true);
            }else{
              reject(Global.suka_kegiatan.fail);
            }
          });
        }else{
          reject(Global.suka_kegiatan.fail)
        }
      })
    };

    //Promise Log
    const promiseLog =  function(like){
      return new Promise(function (resolve, reject) {
        console.log("Like nilai: "+like)
        if(like){
          console.log("Masuk sini")
          FLog.tambahSukaKegiatanLog(req.body, function(callback) {

            if(callback.success == true){

                resolve(true);
            }else{
              reject(Global.tambah_log.fail);
            }
          });
        }else{
          reject(Global.tambah_log.fail)
        }
      })
    };

    //Atur promise
    const consumePromise = function(){
      promiseSession
        .then(promiseLike)
        .then(promiseLog)
        .then(function(){
          return res.json({success: true, data: {message:Global.suka_kegiatan.success,kode:statusLike}})
        })
        .catch(function(error){
          return res.json({success: false, data: {message:error}})
        })
    };

    consumePromise();

  }
}

exports.suka_status = function(req,res) {
  //Inisial validasi
  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('pengguna', 'Mohon isi id pengguna').notEmpty();
  req.checkBody('kegiatan', 'Mohon isi id kegiatan').notEmpty();


  //Dibersihkan dari Special Character
  req.sanitize('access_token').escape();
  req.sanitize('access_token').trim();

  req.sanitize('pengguna').escape();
  req.sanitize('pengguna').trim();

  req.sanitize('kegiatan').escape();
  req.sanitize('kegiatan').trim();

  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan
      return res.json({success: false, data: errors})
  }else{
    //Promise cek session -> status like sudah dilike atau belum
    //Promise Session
    const promiseSession =  new Promise(function (resolve, reject) {
      FSession.cek(req.body, function(callback) {
        if(callback.success){
            resolve(true)
        }else{
            reject(Global.session.fail)
        }
      });
    });

    //Promise Status Like
    const promiseStatusLike =  function(session){
      return new Promise(function (resolve, reject) {
        if(session){
          FKegiatan.statusLike(req.body, function(callback) {
            if(arguments[0]){
                resolve(arguments[1]);
            }else{
              reject(Global.status_suka_kegiatan.fail);
            }
          });
        }else{
          reject(Global.status_suka_kegiatan.fail)
        }
      })
    };

    //Atur Promise
    consumePromise = function(){
      promiseSession
        .then(promiseStatusLike)
        .then(function(data){
          if(data > 0){//Sudah pernah dilike
            return res.json({success: true, data: {statusKomentar:1}})
          }else if(data == 0){//Belum pernah dilike
            return res.json({success: true, data: {statusKomentar:0}})
          }
        })
        .catch(function(error){
          return res.json({success: false, data: {message:Global.status_suka_kegiatan.fail}})
        })
    };


    //Eksekusi promise
    consumePromise()
  }
}

exports.suka_daftar = function(req,res) {
  //Inisial validasi
  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('kegiatan', 'Mohon isi id kegiatan').notEmpty();

  //Dibersihkan dari Special Character
  req.sanitize('access_token').escape();
  req.sanitize('access_token').trim();

  req.sanitize('kegiatan').escape();
  req.sanitize('kegiatan').trim();

  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan
      return res.json({success: false, data: errors})
  }else{
    //Promise cek session -> penguna yang melike kegiatan
    //Promise Session
    const promiseSession =  new Promise(function (resolve, reject) {
      FSession.cek(req.body, function(callback) {
        if(callback.success){
            resolve(true)
        }else{
            reject(Global.session.fail)
        }
      });
    });

    //Promise Pengguna Like
    var dataBanyakPenyuka, dataPenyuka = null;
    const promisePenggunaLike =  function(session){
      return new Promise(function (resolve, reject) {
        if(session){
          FKegiatan.penggunaLike(req.body, function(callback) {
            if(arguments[0]){
                dataBanyakPenyuka = arguments[1]
                dataPenyuka = arguments[2]

                resolve(true);
            }else{
              reject(Global.penyuka_kegiatan.fail);
            }
          });
        }else{
          reject(Global.penyuka_kegiatan.fail);
        }
      })
    };

    //Atur Promise
    const consumePromise = function(){
      promiseSession
        .then(promisePenggunaLike)
        .then(function(data){
          return res.json({success: true, data: dataBanyakPenyuka, dataPenyuka: dataPenyuka})
        })
        .catch(function(data){
          return res.json({success: false, data: {message:Global.penyuka_kegiatan.fail}})
        })
    };

    //Eksekusi Promise
    consumePromise()
  }
}

exports.hapus_kegiatan = function(req,res) {
  //Inisial validasi
  req.checkBody('access_token', 'Akses token tidak boleh kosong').notEmpty();
  req.checkBody('id', 'Mohon isi id kegiatan').notEmpty();
  req.checkBody('pengguna', 'Mohon isi id pengguna').notEmpty();

  //Dibersihkan dari Special Character
  req.sanitize('access_token').escape();
  req.sanitize('access_token').trim();

  req.sanitize('id').escape();
  req.sanitize('id').trim();

  req.sanitize('pengguna').escape();
  req.sanitize('pengguna').trim();

  //Menjalankan validasi
  var errors = req.validationErrors();

  if(errors){//Terjadinya kesalahan
      return res.json({success: false, data: errors})
  }else{
    //Promise cek session -> hapus kegiatan ->tambah log
    //Promise Cek Session
    const promiseSession =  new Promise(function (resolve, reject) {
      FSession.cek(req.body, function(callback) {
        //console.log("session callback: "+callback.success)
        if(callback.success == true){
            resolve(true)
        }else{
            reject(Global.session.fail)
        }
      });
    });

    //Promise Hapus Kegiatan
    const promiseKegiatan =  function(session){
      return new Promise(function (resolve, reject) {
        if(session){
          FKegiatan.hapusKegiatan(req.body, function(callback) {
            if(callback == true){
                resolve(true);
            }else{
              reject(false);
            }
          });
        }else{
          reject(false);
        }
      })
    };

    //Promise Tambah Log
    const promiseLog =  function(poin){
      return new Promise(function (resolve, reject) {
        if(poin){
          FLog.hapusKegiatanLog(req.body, function(callback) {
            if(callback.success == true){
                resolve(true);
            }else{
              reject(false);
            }
          });
        }else{
          reject(false)
        }
      })
    };

    //Atur promise
    const consumePromise = function(){
      promiseSession
        .then(promiseKegiatan)
        .then(promiseLog)
        .then(function () {
          return res.json({success: true, data: {message:Global.hapus_kegiatan.success}})
        })
        .catch(function() {
          return res.json({success: false, data: {message:Global.hapus_kegiatan.fail}})
        })
    }

    //Eksekusi Promise
    consumePromise();

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
    //Promise cek session -> promise daftar kategori kegiatan
    //Promise cek session
    const promiseSession =  new Promise(function (resolve, reject) {
      FSession.cek(req.body, function(callback) {
        //console.log("session callback: "+callback.success)
        if(callback.success == true){
            resolve(true)
        }else{
            reject(Global.session.fail)
        }
      });
    });

    //Promise Hapus Kegiatan
    var kategoriKegiatan;
    const promiseKategoriKegiatan =  function(session){
      return new Promise(function (resolve, reject) {
        if(session){
          FKegiatan.daftarKategoriKegiatan(req.body, function(callback) {
            if(arguments[0] == true){
                kategoriKegiatan = arguments[1]
                resolve(true);
            }else{
              reject(false);
            }
          });
        }else{
          reject(false);
        }
      })
    };

    //Atur promise
    const consumePromise = function(){
      promiseSession
        .then(promiseKategoriKegiatan)
        .then(function () {
          return res.json({success: true, data: kategoriKegiatan})
        })
        .catch(function() {
          return res.json({success: false, data: {message:Global.kategori_kegiatan.fail}})
        })
    }

    //Eksekusi promise
    consumePromise()
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
    //Promise cek session -> semua kegiatan
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

    //Promise Semua Kegiatan
    var semuaKegiatan
    const promiseKegiatan =  function(session){
      return new Promise(function (resolve, reject) {
        if(session){
          FKegiatan.daftarKegiatan(req.body, function(callback) {
            if(arguments[0]){
                semuaKegiatan = arguments[1]
                resolve(true);
            }else{
              reject(false);
            }
          });
        }else{
          reject(false)
        }
      })
    };


    //Atur promise
    const consumePromise = function(){
      promiseSession
        .then(promiseKegiatan)
        .then(function () {
          return res.json({success: true, data: semuaKegiatan})
        })
        .catch(function() {
          return res.json({success: false, data: {message:Global.semua_kegiatan.fail}})
        })
    }

    //Eksekusi promise
    consumePromise()

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
    //Promise cek session -> kegiatan per pengguna

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

    //Promise Kegiatan Per Pengguna
    var kegiatanPengguna
    const promiseKegiatanPerPengguna =  function(session){
      return new Promise(function (resolve, reject) {
        if(session){
          FKegiatan.daftarKegiatanPerPengguna(req.body, function(callback) {
            if(arguments[0]){
                kegiatanPengguna = arguments[1]
                resolve(true);
            }else{
              reject(false);
            }
          });
        }else{
          reject(false)
        }
      })
    };


    //Atur promise
    const consumePromise = function(){
      promiseSession
        .then(promiseKegiatanPerPengguna)
        .then(function () {
          return res.json({success: true, data: kegiatanPengguna})
        })
        .catch(function() {
          return res.json({success: false, data: {message:Global.penguna_kegiatan.fail}})
        })
    }

    //Eksekusi promise
    consumePromise()
  }
}


exports.daftar_per_pengguna_porto = function(req,res) {
   if(req.body.pengguna == '' || req.body.pengguna == null ){
    return res.json({success: false, data: {message:'Username tidak boleh kosong'}})
  }else{
    //Promise Porto Per Pengguna
    var portofolio
    const promisePorto =  new Promise(function (resolve, reject) {
      FKegiatan.daftarPerPenggunaPorto(req.body, function(callback) {
        if(arguments[0] == true){
            portofolio = arguments[1]
            resolve(true)
        }else{
            reject(Global.pengguna_porfo.fail)
        }
      });
    });

    //Atur Promise
    const consumePromise = function(){
      promisePorto
        .then(function(){
          return res.json({success: true, data: Global.pengguna_porfo.fail})
        })
        .catch(function(){
          return res.json({success: false, data: portofolio})
        })
    };

    //Eksekusi promise
    consumePromise()
  }
}
