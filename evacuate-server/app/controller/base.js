'use strict';

const { Controller } = require('egg');
const jwt = require('jsonwebtoken');

class BaseController extends Controller {
  get uid() {
    const { ctx, config } = this;
    const token = ctx.request.get('X-Token');
    const { uid } = jwt.verify(token, config.keys).data;
    return uid;
  }

  success(message, data, code) {
    this.ctx.body = {
      code: code || 20000,
      message: message || 'success',
      data,
    };
  }

  fail(message, data, code) {
    this.ctx.body = {
      code: code || 50000,
      message: message || 'fail',
      data,
    };
  }
}

module.exports = BaseController;
