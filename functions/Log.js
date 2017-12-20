const restClient = require('node-rest-client').Client;
const rClient = new restClient();
const Global = require('../global.json');

exports.tambahKegiatanLog = function(request, callback){
  args = {
          data: {
            access_token: request.access_token,
            id_pengguna: request.pengguna,
            tipe: 4,
            judul: 'Menambahkan kegiatan dengan judul:'+request.judul
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
         };

  rClient.post(Global.devel_api_global+'/log/tambah', args, function (data, response) {
    callback(data);
  })
}

exports.hapusKegiatanLog = function(request, callback){
  args = {
          data: {
            access_token: request.access_token,
            id_pengguna: request.pengguna,
            tipe: 4,
            judul: 'Menghapus kegiatan dengan judul:'+request.judul
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
         };

  rClient.post(Global.devel_api_global+'/log/tambah', args, function (data, response) {
    callback(data);
  })
}

exports.tambahKomentarLog = function(request, callback){
  args = {
          data: {
            access_token: request.access_token,
            id_pengguna: request.pengguna,
            tipe: 4,
            judul: 'Memberikan komentar pada judul kegiatan: '+request.judul
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
         };

  rClient.post(Global.devel_api_global+'/log/tambah', args, function (data, response) {
    callback(data);
  })
}

exports.tambahSukaKegiatanLog = function(request, callback){

  args = {
          data: {
            access_token: request.access_token,
            id_pengguna: request.pengguna,
            tipe: 4,
            judul: 'Meyukai judul judul kegiatan: '+request.judul
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
         };

  rClient.post(Global.devel_api_global+'/log/tambah', args, function (data, response) {
    callback(data);
  })
}
