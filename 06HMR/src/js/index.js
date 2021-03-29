import '../css/index.less'
//引入 iconfont样式文件
import '../css/iconfont.css'

import print from './print.js'

console.log('index.js文件被加载了')

function add(x, y) {
    return x + y
}

console.log(add(1, 2));

// print()

if (module.hot) {
    // 一旦 module.hot 为 true，说明开启了HMR功能。--> 让HMR功能代码生效
    module.hot.accept('./print.js', function () {
        // 方法会监听print.js文件变化，一旦发生变化，其他模块默认不会重新打包构建
        // 会执行后面的回调函数
        print()
    })
}
