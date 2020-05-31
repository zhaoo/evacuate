'use strict';

const Controller = require('./base');

class ExitController extends Controller {
  async list() {
    const { service } = this;
    try {
      const list = await service.exit.getExitList();
      this.success('获取出口列表成功', list);
    } catch (err) {
      this.fail(err);
    }
  }

  async delete() {
    const { ctx, service } = this;
    try {
      const id = ctx.request.body.id;
      await service.exit.deleteExitById(id);
      this.success('删除出口成功');
    } catch (err) {
      this.fail(err);
    }
  }

  async create() {
    const { ctx, service } = this;
    try {
      const params = ctx.request.body;
      await service.exit.createExit(params);
      this.success('添加出口成功');
    } catch (err) {
      this.fail(err);
    }
  }

  async edit() {
    const { ctx, service } = this;
    try {
      const params = ctx.request.body;
      const id = params._id;
      await service.exit.editExitById(id, params);
      this.success('编辑出口成功');
    } catch (err) {
      this.fail(err);
    }
  }
}

module.exports = ExitController;
