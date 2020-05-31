'use strict';

const Controller = require('egg').Controller;

class HelpController extends Controller {
  async getList() {
    const { ctx, service } = this;
    const res = await service.help.getList();
    ctx.body = res;
  }

  async deleteHelp() {
    const { ctx, service } = this;
    const id = ctx.request.body.id;
    const res = await service.help.deleteHelp(id);
    ctx.body = res;
  }
}

module.exports = HelpController;
