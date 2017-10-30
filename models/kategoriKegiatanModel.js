var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var KategoriKegiatanSchema = Schema({
  nama_kategori: {type: String, min: 1, max: 100, required: true},
  created_at: { type: Date, default: Date.now},
  updated_at: { type: Date, default: Date.now}
},{collection: 'kategori_kegiatan'});

//Export model
module.exports = mongoose.model('kategoriKegiatan', KategoriKegiatanSchema);
