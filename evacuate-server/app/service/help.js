'use strict';

const Service = require('egg').Service;

class HelpService extends Service {
  async getList() {
    const { ctx } = this;
    try {
      const res = await ctx.model.Help.find();
      return {
        code: 20000,
        message: '获取求助列表成功',
        data: res,
      };
    } catch (err) {
      return {
        code: 50000,
        message: '获取求助列表失败' + err,
      };
    }
  }

  async deleteHelp(id) {
    const { ctx } = this;
    try {
      await ctx.model.Help.findByIdAndDelete(id);
      return {
        code: 20000,
        message: '删除求助成功',
      };
    } catch (err) {
      return {
        code: 50000,
        message: '删除求助失败' + err,
      };
    }
  }
}

module.exports = HelpService;
