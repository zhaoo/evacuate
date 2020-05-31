'use strict';

const Controller = require('./base');

class UserController extends Controller {
  async login() {
    const { ctx, service } = this;
    try {
      const { username, password } = ctx.request.body;
      const user = await service.user.getUserByLogin(username, ctx.helper.md5(password));
      if (!user) {
        this.fail('用户名或密码错误');
        return;
      }
      const token = await service.user.saveJwt(user.id);
      this.success('登录成功', { token });
    } catch (err) {
      this.fail(err);
    }
  }

  async info() {
    const { service } = this;
    try {
      const user = await service.user.getUserByUid(this.uid);
      if (!user) {
        this.fail('获取管理员信息失败');
        return;
      }
      this.success('获取管理员信息成功', user);
    } catch (err) {
      this.fail(err);
    }
  }

  async logout() {
    try {
      this.success('注销成功');
    } catch (err) {
      this.fail(err);
    }
  }

  async register() {
    const { ctx, service } = this;
    try {
      const params = ctx.request.body;
      params.password = this.helper.module(params.params);
      await service.user.createUser(params);
      this.success('注册用户成功');
    } catch (err) {
      this.fail(err);
    }
  }

}

module.exports = UserController;
