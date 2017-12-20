const Kegiatan = require('../models/kegiatanModel');
const KategoriKegiatan = require('../models/kategoriKegiatanModel');
const Pengguna = require('../models/penggunaModel');
const Absensi = require('../models/absensiModel');

exports.tambahAbsen = function(request,callback){
  var ket
  if(request.totaldetik >= 0 && request.totaldetik <= 26100){
    ket = 'tepat waktu'
  }else{
    ket = 'terlambat'
  }

  var inputan = new Absensi(
    {
      pengguna: request.pengguna,
      kelas: request.kelas,
      tanggal: request.tanggal,
      keterangan: ket,
      lokasi: {latitude: request.latitude, longitude:request.longitude}
    }
  );

  inputan.save(function(err){
    if (err) {
      callback(false)
    } else {
      callback(true)
    }
  })
}

exports.absensiPerPengguna = function(request,callback){
  Absensi.find({pengguna:request.pengguna})
   .exec(function (err, results) {
     if(err){
       callback(false)
     }
     callback(true,results)
   })
}

exports.absensiPerKelas = function(request,callback){
  Absensi.find({kelas:request.kelas})
   .exec(function (err, results) {
     if(err){
       callback(false)
     }
     callback(true,results)
   })
}
