const query = require('../../config/queryConfig')

module.exports = {
  test: (data) => {
    const sql = `select * from pet_type`
    return query(sql, data)
  },
}
