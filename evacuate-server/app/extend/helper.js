'use strict';

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports = {
  setToken(data, expires = 7200) {
    const exp = Math.floor(Date.now() / 1000) + expires;
    return jwt.sign({ data, exp }, this.config.keys);
  },
  md5(data) {
    return crypto.createHash('md5').update(data).digest('hex');
  },
};
