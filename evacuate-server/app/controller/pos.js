'use strict';

const Controller = require('egg').Controller;

class MainController extends Controller {
  async setPos() {
    const { ctx, service } = this;
    const { pos, token } = ctx.request.body;
    const res = await service.pos.setPos(pos, token);
    ctx.body = res;
  }

  async getList() {
    const { ctx, service } = this;
    const res = await service.pos.getList();
    ctx.body = res;
  }
}

module.exports = MainController;
