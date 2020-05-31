'use strict';

const Service = require('egg').Service;

class MonitorService extends Service {
  async getList() {
    const { ctx } = this;
    try {
      const res = await ctx.model.Monitor.find();
      return {
        code: 20000,
        message: '获取监测点列表成功',
        data: res,
      };
    } catch (err) {
      return {
        code: 50000,
        message: '获取监测点列表失败' + err,
      };
    }
  }

  async getEffectList() {
    const { ctx } = this;
    try {
      const res = await ctx.model.Monitor.find({ key: { $exists: true }, temperature: { $exists: true }, lng: { $exists: true }, lat: { $exists: true } });
      return {
        code: 20000,
        message: '获取监测点列表成功',
        data: res,
      };
    } catch (err) {
      return {
        code: 50000,
        message: '获取监测点列表失败' + err,
      };
    }
  }

  async deleteMonitor(id) {
    const { ctx } = this;
    try {
      await ctx.model.Monitor.findByIdAndDelete(id);
      return {
        code: 20000,
        message: '删除监测点成功',
      };
    } catch (err) {
      return {
        code: 50000,
        message: '删除监测点失败' + err,
      };
    }
  }

  async createMonitor(data) {
    const { ctx } = this;
    try {
      await ctx.model.Monitor.create(data);
      return {
        code: 20000,
        message: '新建监测点成功',
      };
    } catch (err) {
      return {
        code: 50000,
        message: '新建监测点失败' + err,
      };
    }
  }

  async editMonitor(data) {
    const { ctx } = this;
    try {
      await ctx.model.Monitor.findByIdAndUpdate(data._id, data);
      return {
        code: 20000,
        message: '编辑监测点成功',
      };
    } catch (err) {
      return {
        code: 50000,
        message: '编辑监测点失败' + err,
      };
    }
  }

  async uploadMonitor(data) {
    const { ctx } = this;
    try {
      for (const item in data) {
        const res = await ctx.model.Monitor.findOne({ key: item });
        if (!res) {
          await ctx.model.Monitor.create({ key: item, temperature: data[item] });
        } else {
          await ctx.model.Monitor.findOneAndUpdate({ key: item }, { key: item, temperature: data[item] });
        }
      }
      return {
        code: 20000,
        message: '上传监测点成功',
      };
    } catch (err) {
      return {
        code: 50000,
        message: '上传监测点失败' + err,
      };
    }
  }
}

module.exports = MonitorService;
