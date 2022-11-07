const cors = require('cors')

const whitelist = ['http://172.16.141.16:3062', 'http://localhost:3062']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}

const setCors = cors(corsOptions)

module.exports = setCors
