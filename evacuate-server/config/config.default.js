'use strict';

module.exports = appInfo => {
  const config = exports = {};

  config.keys = appInfo.name + 'evacuate';

  config.cluster = {
    listen: {
      port: 7001,
      hostname: '',
    },
  };

  config.middleware = [ 'jwt' ];

  config.jwt = {
    enable: false,
    ignore: [
      '/public/',
      '/api/user/logout',
      '/api/user/login',
    ],
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.mongoose = {
    url: process.env.EGG_MONGODB_URL || 'mongodb://127.0.0.1/evacuate',
    options: {
      server: {
        poolSize: 40,
      },
    },
  };

  config.io = {
    init: { },
    namespace: {
      '/': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
    },
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  const userConfig = {
  };

  return {
    ...config,
    ...userConfig,
  };
};
