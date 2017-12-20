const restClient = require('node-rest-client').Client;
const rClient = new restClient();
const Global = require('../global.json');

exports.cek = function(request,callback){
  //console.log("aasa:"+Global.devel_api_global);
  const args = {
          data: {
            access_token: request.access_token},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
         };

  rClient.post(Global.devel_api_global+'/cek_session', args, function (data, response) {
      callback(data);
  });
}
