'use strict'

const debug = require('debug')('gapgent:api:db')

module.exports = {
  db: {
    database: process.env.DB_NAME || 'parking',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PWD || 'Gapuser123',
    host: process.env.DB_HOST || '',
    dialect: 'mysql',
    logging: s => debug(s)
  }
}
