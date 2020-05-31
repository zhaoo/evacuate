'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getUserByLogin(username, password) {
    const { ctx } = this;
    return await ctx.model.User.findOne({ username, password });
  }

  async saveJwt(uid) {
    const { ctx } = this;
    return ctx.helper.setToken({ type: 'user', uid }, 7200);
  }

  async getUserByUid(uid) {
    const { ctx } = this;
    return await ctx.model.User.findById(uid);
  }

  async createUser(params) {
    const { ctx } = this;
    await ctx.model.User.create(params);
  }
}

module.exports = UserService;
