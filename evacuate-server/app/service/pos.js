'use strict';

const Service = require('egg').Service;

class MainService extends Service {
  async setPos(pos, token) {
    const { ctx } = this;
    try {
      const res = await ctx.model.Pos.findOne({token})
      if (!res) {
        await ctx.model.Pos.create({pos, token});
      } else {
        await ctx.model.Pos.findOneAndUpdate({token}, {pos, time: new Date})
      }
      return {
        code: 20000,
        message: '发送定位信息成功',
      };
    } catch (err) {
      return {
        code: 50000,
        message: '发送定位信息失败' + err,
      };
    }
  }

  async getList() {
    const { ctx } = this;
    try {
      const res = await ctx.model.Pos.find()
      return {
        code: 20000,
        message: '获取定位列表成功',
        data: res
      };
    } catch (err) {
      return {
        code: 50000,
        message: '获取定位列表失败' + err,
      };
    }
  }
}

module.exports = MainService;
