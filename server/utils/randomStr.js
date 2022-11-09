const randomStr =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'

const createRandomStr = (type) => {
  let result = ''
  let strLength = 0
  switch (type) {
    case 'userName':
      strLength = 10
      break
    default:
      break
  }
  for (let i = 1; i <= strLength; i++) {
    result += randomStr[Math.floor(Math.random() * randomStr.length)]
  }
  return result
}

module.exports = createRandomStr
