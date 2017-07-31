var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AbsensiSchema = Schema({
  pengguna: {type: Schema.ObjectId, min: 1, max: 100, required: true},
  kelas: {type: Schema.ObjectId, min: 1, max: 100, required: true},
  keterangan: { type: String, min: 1, max: 100, required: true},
  lokasi: {latitude:{type: String, required: true},longitude:{type: String, required: true}},
  created_at: { type: Date, default: Date.now}
},{collection: 'absensi'});

//Export model
module.exports = mongoose.model('absensi', AbsensiSchema);
