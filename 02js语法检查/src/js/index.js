function add(x, y) {
  return x + y;
}

function reduce(x, y) {
  return x - y;
}

console.log(reduce(3, 2));

// 下一行eslint所有规则不生效（不进行）
// eslint-disable-next-line
consoele.log(add(1,2))