var mongoose = require('mongoose');
var moment = require('moment')
var async = require('async');

var Schema = mongoose.Schema;

var KegiatanSchema = Schema({
  judul: {type: String, min: 1, max: 100, required: true},
  pengguna: {type: Schema.ObjectId, ref: 'users', required: true},
  kategori: {type: Schema.ObjectId, ref: 'kategori_kegiatan', required: true},
  file_berkas: {type: String, min: 1, max: 100, required: true},
  lokasi: {latitude:{type: String, required: true},longitude:{type: String, required: true}},
  komentar:[
    {
      pengguna:{type: Schema.ObjectId, ref: 'users'},
      komentar:{type: String, min: 1, max: 100},
      created_at: { type: Date, default: Date.now}
    }
  ],
  suka:[
    {
      pengguna:{type: Schema.ObjectId, ref: 'users'},
      created_at: { type: Date, default: Date.now}
    }
  ],
  created_at: { type: Date, default: Date.now},
  updated_at: { type: Date, default: Date.now}
},{collection: 'kegiatan'});

//Export model
module.exports = mongoose.model('kegiatan', KegiatanSchema)
