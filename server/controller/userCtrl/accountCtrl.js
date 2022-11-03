const userDao = require('../../dao/userDao/accountDao')

module.exports = {
  //   test
  test: async (req, res) => {
    const result = await userDao.test()
    res.json({
      code: 200,
      data: result,
    })
  },
}
