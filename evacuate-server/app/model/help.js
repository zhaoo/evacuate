'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const HelpSchema = new Schema({
    token: String,
    time: {
      type: Date,
      default: Date.now,
    },
    lng: String,
    lat: String
  });
  return mongoose.model('Help', HelpSchema, 'help');
};
