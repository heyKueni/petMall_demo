const userDao = require('../../modules/userDao/index')

module.exports = {
  //   test
  test: () => {
    userDao.then((res) => {
      console.log(res)
    })
  },
}
