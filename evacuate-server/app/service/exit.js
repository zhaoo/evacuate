'use strict';

const Service = require('egg').Service;

class ExitService extends Service {
  async getExitList() {
    const { ctx } = this;
    return await ctx.model.Exit.find();
  }

  async deleteExitById(id) {
    const { ctx } = this;
    await ctx.model.Exit.findByIdAndDelete(id);
  }

  async createExit(data) {
    const { ctx } = this;
    await ctx.model.Exit.create(data);
  }

  async editExitById(id, params) {
    const { ctx } = this;
    await ctx.model.Exit.findByIdAndUpdate(id, params);
  }
}

module.exports = ExitService;
