var mongoose = require('mongoose');

//Koneksi ke general collection
//var koneksi_general_collections = mongoose.createConnection('mongodb://thesisvidyanusa:kjc5qvrh@167.205.7.230:27017/vidyanusa-general-collections');

var Schema = mongoose.Schema;

// var PenggunaSchema = koneksi_general_collections.model('pengguna', Schema({
//   profil:{username: {type: String, min: 1, max: 100, required: true}}
// },{collection: 'pengguna'})))

var PenggunaSchema = Schema({
  profil:{username: {type: String, min: 1, max: 100, required: true}}
},{collection: 'pengguna'})


//Export model
module.exports = PenggunaSchema;
