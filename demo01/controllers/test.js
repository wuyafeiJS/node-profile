const rq = require('../core/request');

module.exports = (router) => {

    // 内存泄露调试

    let theThing = null
    let replaceThing = function () {
        let leak = theThing
        let unuse = function () {
            if (leak) console.log('hi')
        }
        theThing = {
            longStr: new Array(1000000).join('*'),
            someMethod: function () {
                if(leak) 
                console.log('a')
            }
        }
    }
    router.get('/leak', async ctx => {
        replaceThing()
        ctx.body = '内存泄露测试'
    })
    // cpu性能调试
    let i = 0;
    let testProfile = () => {
       i ++
       let arr = new Array(10000);
       let str = JSON.stringify(arr);
       if (i < 10000) {
         testProfile()
       } else {
           return arr
       }
    }
    router.get('/profile', async ctx => {
        testProfile();
        ctx.body = 'cpu性能测试'
    })
}
