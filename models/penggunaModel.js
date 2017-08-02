var mongoose = require('mongoose');
var moment = require('moment')

//Koneksi
var koneksi_general_collections = mongoose.createConnection('mongodb://thesisvidyanusa:kjc5qvrh@167.205.7.230:27017/vidyanusa-general-collections');

var Schema = mongoose.Schema;

var UserSchema = Schema({
  profil:{
    username: {type: String, min: 1, max: 100, required: true},
    foto: {type: String, min: 1, max: 100, default: 'http://filehosting.pptik.id/TESISS2ITB/Vidyanusa/default-profile-picture.png'}
  }
},{collection: 'pengguna'});


//Export model
module.exports = koneksi_general_collections.model('pengguna', UserSchema)
