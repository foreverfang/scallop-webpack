// eslint-disable-next-line
console.log('index文件被加载');

// import { mul } from './test'

document.getElementById('btn').onclick = function () {
    // 懒加载 当文件需要使用时才加载
    // 预加载 prefetch：在使用前，会提前加载js文件  有兼容性问题（可以去can i use 查看是否存在）
    // 正常加载可以认为是并行加载（同一时间加载多个文件）。 预加载 prefetch: 等其他资源加载完毕，浏览器空闲了，再偷偷加载资源
    import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test')
        .then(({ mul }) => {
            // eslint-disable-next-line
            console.log(mul(5, 6))
        }).catch(() => { })
}