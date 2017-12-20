const restClient = require('node-rest-client').Client;
const rClient = new restClient();
const Global = require('../global.json');

exports.tambahPoin = function(request, callback){  
  args = {
          data: {
            access_token: request.access_token,
            jumlah_poin: 1,
            keterangan: 'poin didapatkan dari menambahkan kegiatan',
            id_pengguna: request.pengguna
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
         };

  rClient.post(Global.devel_api_global+'/poin/tambah', args, function (data, response) {
    callback(data);
  })
}
