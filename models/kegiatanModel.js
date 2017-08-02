var mongoose = require('mongoose');
var moment = require('moment')
var async = require('async');

//Koneksi
var koneksi_general_collections = mongoose.createConnection('mongodb://thesisvidyanusa:kjc5qvrh@167.205.7.230:27017/vidyanusa-general-collections');
var koneksi_portal_collections = mongoose.createConnection('mongodb://thesisvidyanusa:kjc5qvrh@167.205.7.230:27017/vidyanusa');

var Schema = mongoose.Schema;

var KategoriKegiatanSchema = Schema({
  nama_kategori: {type: String, min: 1, max: 100, required: true}
},{collection: 'kategori_kegiatan'});

var KegiatanSchema = Schema({
  judul: {type: String, min: 1, max: 100, required: true},
  pengguna: {type: Schema.ObjectId, required: true},
  username: {type: String, min: 1, max: 100, required: true},
  kategori: {type: Schema.ObjectId, ref: 'kategori_kegiatan', required: true},
  file_berkas: {type: String, min: 1, max: 100, required: true},
  lokasi: {latitude:{type: String, required: true},longitude:{type: String, required: true}},
  created_at: { type: Date, default: Date.now},
  updated_at: { type: Date, default: Date.now}
},{collection: 'kegiatan'});

var UserSchema = Schema({
  email: {type: String, min: 1, max: 100, required: true}
},{collection: 'pengguna'});

//Export model
module.exports = koneksi_general_collections.model('users', UserSchema)
module.exports = koneksi_portal_collections.model('kategori_kegiatan', KategoriKegiatanSchema)
module.exports = koneksi_portal_collections.model('kegiatan', KegiatanSchema)
