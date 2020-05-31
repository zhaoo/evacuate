'use strict';

const Controller = require('egg').Controller;

class HelpController extends Controller {
  async postHelp() {
    const { ctx } = this;
    const msg = ctx.args;
    await this.getHelp(msg);
  }

  async getHelp(msg) {
    const { app } = this;
    const io = app.io;
    await io.emit('getHelp', msg);
  }

}

module.exports = HelpController;
