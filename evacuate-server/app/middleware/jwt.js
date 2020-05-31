'use strict';
const jwt = require('jsonwebtoken');

module.exports = (options, app) => {
  return async function userInterceptor(ctx, next) {
    try {
      const token = ctx.request.get('X-Token');
      if (token) {
        const res = verifyToken(token, app);
        if (res.uid) {
          await next();
        } else {
          ctx.body = { code: 50014, message: '登录状态已过期' };
        }
      } else {
        ctx.body = { code: 50008, message: '请登录后再进行操作' };
      }
    } catch (err) {
      ctx.body = { code: 50000, message: err.name };
    }
  };
};

function verifyToken(token, app) {
  let res = '';
  try {
    const result = jwt.verify(token, app.config.keys) || {};
    const { exp } = result,
      current = Math.floor(Date.now() / 1000);
    if (current <= exp) res = result.data || {};
  } catch (e) {
    console.log(e);
  }
  return res;
}
