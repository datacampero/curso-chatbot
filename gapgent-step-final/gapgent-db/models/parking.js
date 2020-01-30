'use strict'

const Sequelize = require('sequelize')
const setupDatabase = require('../lib/db')

module.exports = function setupParkingModel (config) {
  const sequelize = setupDatabase(config)
  return sequelize.define('parking', {
    slot: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })
}
