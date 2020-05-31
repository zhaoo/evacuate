'use strict';

module.exports = app => {
  const { router, controller, io } = app;

  router.post('/api/user/login', controller.user.login);
  router.get('/api/user/info', controller.user.info);
  router.post('/api/user/logout', controller.user.logout);
  router.post('/api/user/register', controller.user.register);

  router.get('/api/exit/list', controller.exit.list);
  router.post('/api/exit/delete', controller.exit.delete);
  router.post('/api/exit/create', controller.exit.create);
  router.post('/api/exit/edit', controller.exit.edit);

  router.post('/api/pos/setPos', controller.pos.setPos);
  router.get('/api/pos/list', controller.pos.getList);

  router.get('/api/monitor/list', controller.monitor.getList);
  router.get('/api/monitor/effectList', controller.monitor.getEffectList);
  router.post('/api/monitor/delete', controller.monitor.deleteMonitor);
  router.post('/api/monitor/create', controller.monitor.createMonitor);
  router.post('/api/monitor/edit', controller.monitor.editMonitor);
  router.post('/api/monitor/upload', controller.monitor.uploadMonitor);

  router.get('/api/help/list', controller.help.getList);
  router.post('/api/help/delete', controller.help.deleteHelp);

  io.of('/').route('postHelp', io.controller.help.postHelp);
};
