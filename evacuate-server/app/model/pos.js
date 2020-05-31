'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const PosSchema = new Schema({
    pos: Array,
    token: String,
    time: {
      type: Date,
      default: Date.now,
    },
  });
  return mongoose.model('Pos', PosSchema, 'pos');
};
