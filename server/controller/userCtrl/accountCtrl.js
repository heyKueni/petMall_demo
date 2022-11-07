const userADao = require('../../dao/userDao/accountDao')

module.exports = {
  // *--------------------------- login
  login: async (req, res) => {
    const result = await userADao.login()
    res.json({
      code: 200,
      data: result,
    })
  },
}
