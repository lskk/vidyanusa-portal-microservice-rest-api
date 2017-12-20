const Kegiatan = require('../models/kegiatanModel');
const KategoriKegiatan = require('../models/kategoriKegiatanModel');
const Pengguna = require('../models/penggunaModel');

exports.tambahKegiatan = function(request,callback){
      var inputan = new Kegiatan(
        {
          judul: request.judul,
          pengguna: request.pengguna,
          kategori: request.kategori,
          file_berkas: request.file_berkas,
          lokasi: {latitude: request.latitude, longitude:request.longitude}
        }
      );
      inputan.save(function(err){
        if (err) {
          callback(false);
        } else {
          callback(true);
        }
      })
}

exports.tambahKomentar = function(request,callback){
  Kegiatan.update({ _id: request.kegiatan },
      { $push:
                      {
                          komentar:{
                          pengguna: request.pengguna,
                          komentar: request.komentar
                        }
                      }
      }
  ).exec(function (err, results) {
    if (err) {
      callback(false);
    } else {
      callback(true);
    }
  })
}

exports.daftarKomentarKegiatan = function(request, callback){
  Kegiatan.find({_id:request.kegiatan})
     .select('komentar')
     .exec(function (err, results) {
       if(err){
          callback(false,null);
       }else{
          callback(true,results);
       }
     })
}

exports.sukaiKegiatan = function(request, callback){
  Kegiatan.find({_id:request.kegiatan, suka:{$elemMatch:{pengguna:request.pengguna}}})
     .exec(function (err, results) {
       var count = results.length
        if(count > 0){//Lakukan remove document index array
          Kegiatan.update( {_id: request.kegiatan},{ $pull: {suka: {pengguna: request.pengguna}}},{ safe: true, multi:true })
            .exec(function (err, results) {
              if(err){
                callback(false)
              }
              callback(true,1)
            })
        }else if(count == 0){//Lakukan add index array
          Kegiatan.update({ _id: request.kegiatan },
              { $push:
                              {
                                  suka:{
                                  pengguna: request.pengguna
                                }
                              }
              }
          ).exec(function (err, results) {
            if(err){
              callback(false)
           }else{
             callback(true,2)
           }
          })
        }
      });
}

exports.statusLike = function(request,callback){
  Kegiatan.find({_id:request.kegiatan, suka:{$elemMatch:{pengguna:request.pengguna}}})
     .exec(function (err, results) {
       if(err){
         callback(false)
      }
       var count = results.length
        if(count > 0){//Sudah pernah dilike
          callback(true,1)
        }else if(count == 0){//Belum pernah dilike
          callback(true,0)
        }else{//Terjadi kesalahan
          callback(false)
        }
      });
}

exports.penggunaLike = function(request, callback){
  Kegiatan.find({_id: request.kegiatan})
   .select('suka')
   .populate({
     path: 'suka.pengguna',model:Pengguna
   })
   .exec(function (err, results) {
     if(err){
       callback(false)
     }else{
        let response = {data: results}
        callback(true,response.data[0].suka.length,response.data[0].suka)
     }
   })
}

exports.hapusKegiatan = function(request, callback){
  Kegiatan.remove({ _id: request.id }, function (err) {
      if (err) {
        callback(false)
      }else{
        callback(true)
      }
    });
}

exports.daftarKategoriKegiatan = function(request, callback){
  KategoriKegiatan.find({}).select({nama_kategori:1})
   .exec(function (err, results) {
     //return res.json({success: true, data: results})
     callback(true,results)
   })
}

exports.daftarKegiatan = function(request, callback){
  Kegiatan.find({})
         .sort([['created_at', 'descending']])
         .populate({
           path: 'pengguna',model:Pengguna
         })
         .populate({
           path: 'kategori',model:KategoriKegiatan
         })
         .populate({
           path: 'komentar.pengguna',model:Pengguna
         })
         .exec(function (err, results) {
           if(err){
             callback(false)
           }
           callback(true,results)
         })
}

exports.daftarKegiatanPerPengguna = function(request, callback){
  Kegiatan.find({pengguna:request.pengguna})
         .sort([['created_at', 'descending']])
         .populate({
           path: 'kategori',model:KategoriKegiatan
         })
         .exec(function (err, results) {
           if(err){
             callback(false)
           }
           callback(true,results)
         })
}

exports.daftarPerPenggunaPorto = function(request, callback){
  Kegiatan.find({pengguna:request.pengguna})
     .exec(function (err, results) {
      var data = results;
       if(err){
        callback(false)
        }else{
          callback(true,results)
        }
});
}
