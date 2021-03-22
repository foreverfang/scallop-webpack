// import '@babel/polyfill' //直接全部引入，可用，但存在体积过大的问题

const add = (x, y) => {
    return x + y;
}
console.log(add(1, 2))

const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('定时器执行完成')
        resolve()
    }, 1000)
})

console.log(promise)
