const query = require('../../config/queryConfig')

module.exports = {
  login: (data) => {
    const sql = `select * from pet_type`
    return query(sql, data)
  },
}
