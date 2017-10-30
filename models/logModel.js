var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LogSchema = Schema({
  pengguna: {type: Schema.ObjectId, min: 1, max: 100, required: true},
  keterangan: { type: String, min: 1, max: 100, required: true},
  created_at: { type: Date, default: Date.now}
},{collection: 'log_kegiatan'});

//Export model
module.exports = mongoose.model('log', LogSchema);
