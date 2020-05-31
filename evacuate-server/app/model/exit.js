'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ExitSchema = new Schema({
    key: String,
    x: Number,
    y: Number,
    floor: Number,
    note: String,
  });
  return mongoose.model('Exit', ExitSchema, 'exit');
};
