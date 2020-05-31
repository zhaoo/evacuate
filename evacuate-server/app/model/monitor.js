'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const MonitorSchema = new Schema({
    key: String,
    temperature: String,
    x: Number,
    y: Number,
    floor: Number,
    note: String,
    picture: String,
  });
  return mongoose.model('Monitor', MonitorSchema, 'monitor');
};
