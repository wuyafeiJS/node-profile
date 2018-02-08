const path = require('path');
const http = require('http');
const Koa = require('koa');
const serve = require('koa-static');
const favicon = require('koa-favicon');
const co = require('bluebird').coroutine;
const render = require('koa-swig');
const logger = require('./core/logger');
const config = require('./config');
const session = require('./core/session');
// easy-monitor
  logger.info('Easy-Monitor性能监控开始...')
  const easyMonitor = require('easy-monitor')
  easyMonitor({
    cluster: true,
    bootstrap: 'embrace',
    project_name: 'nodejs-server',
    /**
       @param {string} tcp_host 填写你部署的 dashboard 进程所在的服务器 ip
       @param {number} tcp_port 填写你部署的 dashboard 进程所在的服务器 端口
       **/
    embrace: {
      tcp_host: '127.0.0.1',
      tcp_port: 26666
    }
  })
const app = module.exports = new Koa();

app.use(session({
    key: "gfactivity",   //default "koa:sid"
    expires:3, //default 7
    path:"/" //default "/"
}));

// static file serving
app.use(serve(path.join(__dirname, '/public')));
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));

// router
app.use(require('./core/router'));

app.context.render = co(render({
    root: path.join(__dirname, '/views'),
    autoescape: true,
    cache: 'memory', // disable, set to false
    ext: 'html',
    writeBody: false
}));

const server = http.createServer(app.callback());
if (!module.parent) {
  server.listen(process.env.PORT || 1111);
  server.on('listening', () => {
    logger.info('Server listening on http://localhost:%d', server.address().port);
  });
}

process.on('uncaughtException', (err) => {
  if (_.isString(err)) {
    err = new Error(err);
  }
  logger.error(err.stack);
  try {
    const killTimer = setTimeout(() => {
      process.exit(1);
    }, 30000);
    killTimer.unref();
    server.close();
  } catch (e) {
    logger.error('error when exit', e.stack);
  }
});

module.exports = server;
