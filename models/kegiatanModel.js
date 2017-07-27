var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var KegiatanSchema = Schema({
  judul: {type: String, min: 1, max: 100, required: true},
  pengguna: {type: Schema.ObjectId, min: 1, max: 100, required: true},
  kategori: {type: Schema.ObjectId, ref: 'kategori_kegiatan', required: true},
  file_berkas: {type: String, min: 1, max: 100, required: true},
  lokasi: {latitude:{type: String, required: true},longitude:{type: String, required: true}},
  created_at: { type: Date, default: Date.now},
  updated_at: { type: Date, default: Date.now}
},{collection: 'kegiatan'});

//Export model
module.exports = mongoose.model('kegiatan', KegiatanSchema);
