const pool = require('./dbConfig')

function query(sql, data) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (!err) {
        connection.query(sql, data, (dbErr, res) => {
          !err ? resolve(res) : reject(dbErr)
          connection.release()
        })
      } else {
        reject(err)
      }
    })
  })
}

module.exports = query
