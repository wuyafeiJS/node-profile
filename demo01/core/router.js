/*
* @Author: lizhonghui
* @Date:   2017-01-11 11:33:49
* @Last Modified by:   lizhonghui
* @Last Modified time: 2017-01-11 15:50:56
*/

const Router = require('lark-router');
let router = new Router();

// cors跨域
// router.all('/api/*', async (ctx,next)=>{  
//   ctx.set("Access-Control-Allow-Origin", "*");  
//   await next();  
// });     

router.get('/', ctx => ctx.body = 'This is koa2-skeleton!'); // index page
router.load(`${__dirname.replace("/core","")}/controllers`);

// gfactivity
// require('../controllers/gfactivity/tplinfo')(router);
// require('../controllers/common/upload')(router);
module.exports = router.routes();
