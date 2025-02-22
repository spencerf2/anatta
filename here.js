function tree (n) {
  str = ''
  for (let i = 0; i < n; i++) {
    if (i === 0) {
      str = '*'
    }
    console.log(str)
    str += '*'
  }
  console.log(str)
}

console.log(tree(3))