'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    username: {
      type: String,
      unique: true,
    },
    password: String,
    nickname: String,
    avatar: {
      type: String,
      default: '/public/avatar/default.jpg',
    },
  });
  return mongoose.model('User', UserSchema, 'user');
};
