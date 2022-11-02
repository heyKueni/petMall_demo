const query = require('../../config/queryConfig')

module.exports = {
  test: (data) => {
    const sql = `select * from user_level`
    return query(sql, data)
  },
}
