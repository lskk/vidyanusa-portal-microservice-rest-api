//Import model
var Kegiatan = require('../models/kegiatanModel');
var Log = require('../models/logModel');
var KategoriKegiatan = require('../models/kategoriKegiatanModel');
var Pengguna = require('../models/penggunaModel');

//Import library
var async = require('async');
var moment = require('moment');
var restClient = require('node-rest-client').Client;
var rClient = new restClient();


var mongoose = require('mongoose');

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

        //Mengatur proses
        async.series({
              one: function(callback) {
                //Menambahkan ke collection kegiatan
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
              },
              three: function(callback) {
                //Menambahkan log
                args = {
                      	data: {
                          access_token: req.body.access_token,
                          id_pengguna: req.body.pengguna,
                          tipe: 4,
                          judul: 'Menambahkan kegiatan dengan judul:'+req.body.judul
                        },
                      	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                       };

                rClient.post(base_api_general_url+'/log/tambah', args, function (data, response) {
                  if(data.success == true){//poin berhasil ditambahkan
                    console.log('Log berhasil ditambahkan')
                    return res.json({success: true, data: {message:'Kegiatan anda berhasil di tambahkan.'}})
                  }else{
                    console.log('Log gagal ditambahkan')
                    return res.json({success: false, data: {message:'Kegiatan anda gagal di tambahkan.'}})
                  }
                })


                callback(null,3)
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

    args = {
            data: {
              access_token: req.body.access_token},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
           };

    rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {
      if(data.success == true){//session berlaku

        console.log('id kegiatan:'+req.body.kegiatan)
        //Mengatur proses
        async.series({
              one: function(callback) {
                //Menambahkan komentar kegiatan
                Kegiatan.update({ _id: req.body.kegiatan },
                    { $push:
                                    {
                                        komentar:{
                                        pengguna: req.body.pengguna,
                                        komentar: req.body.komentar
                                      }
                                    }
                    }
                ).exec(function (err, results) {
                  if(err){
                    console.log('Gagal menambahkan komentar karena: '+err)
                   //return res.json({success: false, data: {message:err}})
                 }else{
                   console.log('Berhasil menambahkan komentar')
                   //return res.json({success: true, data: {message:'Berhasil menambahkan komentar.'}})
                 }
                })

                callback(null, 1);
              },
              two: function(callback){

                //Menambahkan log
                args = {
                        data: {
                          access_token: req.body.access_token,
                          id_pengguna: req.body.pengguna,
                          tipe: 4,
                          judul: 'Mengomentari sebuah kegiatan'
                        },
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                       };

                rClient.post(base_api_general_url+'/log/tambah', args, function (data, response) {
                  if(data.success == true){
                    console.log('Log berhasil ditambahkan')
                    return res.json({success: true, data: {message:'Komentar anda berhasil ditambahkan pada kegiatan.'}})
                  }else{
                    console.log('Log gagal ditambahkan')
                    return res.json({success: false, data: {message:'Komentar anda gagal ditambahkan pada kegiatan.'}})
                  }
                })

                callback(null, 2);
              }
          }, function(err, results) {
              // results is now equal to: {one: 1, two: 2}
          })

      }else{//session tidak berlaku
        return res.json({success: false, data: {message:data.data.message}})
      }
    });

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

    args = {
            data: {
              access_token: req.body.access_token},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
           };

    rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {
      if(data.success == true){//session berlaku

        console.log('id kegiatan:'+req.body.kegiatan)

        Kegiatan.find({_id:req.body.kegiatan})
           .select('komentar')
           .exec(function (err, results) {
             if(err){
                return res.json({success: false, data: {message:"Gagal mendapatkan daftar komentar karena: "+err}})
             }else{
                return res.json({success: true, data: results})
             }
           })

      }else{//session tidak berlaku
        return res.json({success: false, data: {message:data.data.message}})
      }
    });

  }

}

exports.suka = function(req,res) {

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

    args = {
            data: {
              access_token: req.body.access_token},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
           };

    rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {
      if(data.success == true){//session berlaku

        //console.log('id kegiatan:'+req.body.kegiatan)
        //Mengatur proses
        var statusSukaKegiatan

        async.series({
              one: function(callback) {
                //Mencek terlebih dahulu apakah pengguna sudah menlike postingan kalau sdh meremove like kl blm menambahkan like

                Kegiatan.find({_id:req.body.kegiatan, suka:{$elemMatch:{pengguna:req.body.pengguna}}})
                   .exec(function (err, results) {

                     var count = results.length
                      if(count > 0){//Lakukan remove document index array
                        console.log('Kegiatan: '+req.body.kegiatan)
                        Kegiatan.update( {_id: req.body.kegiatan},{ $pull: {suka: {pengguna: req.body.pengguna}}},{ safe: true, multi:true })
                          .exec(function (err, results) {
                            if(err){
                              console.log('Gagal mentidak sukai kegiatan karena')
                              return res.json({success: false, data: {message:'Gagal mentidak sukai kegiatan karena:  '+err}})
                            }
                            //return res.json({success: true, data: {message:'Berhasil mentidaksukai kegiatan.'}})
                            console.log('Berhasil mentidak sukai kegiatan')
                            statusSukaKegiatan = "Berhasil mentidaksukai kegiatan."
                          })

                        //return res.json({success: true, data: {message:'B menambahkan guru ke mata pelajaran karena sudah terdaftar di kelas.'}})
                      }else if(count == 0){//Lakukan add index array

                        Kegiatan.update({ _id: req.body.kegiatan },
                            { $push:
                                            {
                                                suka:{
                                                pengguna: req.body.pengguna
                                              }
                                            }
                            }
                        ).exec(function (err, results) {
                          if(err){
                            console.log('Gagal menyukai kegiatan karena: '+err)
                           //return res.json({success: false, data: {message:err}})
                         }else{
                           statusSukaKegiatan = "Berhasil menyukai kegiatan."
                           console.log('Berhasil menyukai kegiatan')
                           //return res.json({success: true, data: {message:'Berhasil menambahkan komentar.'}})
                         }
                        })

                      }

                    });

                callback(null, 1);
              },
              two: function(callback){

                //Menambahkan log
                args = {
                        data: {
                          access_token: req.body.access_token,
                          id_pengguna: req.body.pengguna,
                          tipe: 4,
                          judul: statusSukaKegiatan
                        },
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                       };

                rClient.post(base_api_general_url+'/log/tambah', args, function (data, response) {
                  if(data.success == true){
                    console.log('Log berhasil ditambahkan')
                    return res.json({success: true, data: {message:statusSukaKegiatan}})
                  }else{
                    console.log('Log gagal ditambahkan')
                    return res.json({success: false, data: {message:statusSukaKegiatan}})
                  }
                })

                callback(null, 2);
              }
          }, function(err, results) {
              // results is now equal to: {one: 1, two: 2}
          })

      }else{//session tidak berlaku
        return res.json({success: false, data: {message:data.data.message}})
      }
    });

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

    args = {
            data: {
              access_token: req.body.access_token},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
           };

    rClient.post(base_api_general_url+'/cek_session', args, function (data, response) {
      if(data.success == true){//session berlaku

        /*Kegiatan.find({_id:req.body.kegiatan})
           .select('suka')
           .exec(function (err, results) {
             if(err){
                return res.json({success: false, data: {message:"Gagal mendapatkan daftar suka karena: "+err}})
             }else{
               var count = results.length
                return res.json({success: true, data: count})
             }
           })
       */
       Kegiatan.find({_id: req.body.kegiatan})
        .select('suka')
        .exec(function (err, results) {
          if(err){
             return res.json({success: false, data: {message:"Gagal mendapatkan daftar suka karena: "+err}})
          }else{
             var response = {data: results}
             return res.json({success: true, data: response.data[0].suka.length})
          }
        })

      }else{//session tidak berlaku
        return res.json({success: false, data: {message:data.data.message}})
      }
    });

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
                //Menghapus  kegiatan di collection kegiatan
                Kegiatan.remove({ _id: req.body.id }, function (err) {
                    if (err) {
                      console.log('Terjadi error menghapus kegiatan')
                    }else{
                      console.log('Berhasil menghapus kegiatan')
                    }
                    // removed!

                  });

                callback(null, 1);
              },
              two: function(callback){

                //Menambahkan log
                args = {
                      	data: {
                          access_token: req.body.access_token,
                          id_pengguna: req.body.pengguna,
                          tipe: 4,
                          judul: 'Menghapus sebuah kegiatan'
                        },
                      	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                       };

                rClient.post(base_api_general_url+'/log/tambah', args, function (data, response) {
                  if(data.success == true){
                    console.log('Log berhasil ditambahkan')
                    return res.json({success: true, data: {message:'Kegiatan anda berhasil dihapus.'}})
                  }else{
                    console.log('Log gagal ditambahkan')
                    return res.json({success: false, data: {message:'Kegiatan anda gagal dihapus.'}})
                  }
                })

                callback(null, 2);
              }
          }, function(err, results) {
              // results is now equal to: {one: 1, two: 2}
          })



      }else{//session tidak berlaku
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
         .sort([['created_at', 'descending']])
         .populate({
           path: 'kategori',model:KategoriKegiatan
         })
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

exports.daftar_per_pengguna_porto = function(req,res) {
   if(req.body.pengguna == '' || req.body.pengguna == null ){
    return res.json({success: false, data: {message:'Username tidak boleh kosong'}})
  }else{

      Kegiatan.find({pengguna:req.body.pengguna})
         .exec(function (err, results) {
          var data = results;
           if(err){
            return res.json({success: false, data: err})
            }else{
            return res.json({success: true, data: results})
      }
    });

  }

}
