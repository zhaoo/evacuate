'use strict';

const Controller = require('egg').Controller;

class MonitorController extends Controller {
  async getList() {
    const { ctx, service } = this;
    const res = await service.monitor.getList();
    ctx.body = res;
  }

  async getEffectList() {
    const { ctx, service } = this;
    const res = await service.monitor.getEffectList();
    ctx.body = res;
  }

  async deleteMonitor() {
    const { ctx, service } = this;
    const id = ctx.request.body.id;
    const res = await service.monitor.deleteMonitor(id);
    ctx.body = res;
  }

  async createMonitor() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.monitor.createMonitor(data);
    ctx.body = res;
  }

  async editMonitor() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.monitor.editMonitor(data);
    ctx.body = res;
  }

  async uploadMonitor() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const res = await service.monitor.uploadMonitor(data);
    ctx.body = res;
  }
}

module.exports = MonitorController;
