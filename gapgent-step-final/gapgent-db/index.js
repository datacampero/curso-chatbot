'use strict'

const defaults = require('defaults')
const setupDatabase = require('./lib/db')
/** Models */
const setupUserModel = require('./models/user')
const setupParkingModel = require('./models/parking')
const setupAssignModel = require('./models/assing')
/** libs */
const setupUser = require('./lib/user')
const setupParking = require('./lib/parking')
const setupAssign = require('./lib/assign')

module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  })

  const sequelize = setupDatabase(config)
  const UserModel = setupUserModel(config)
  const ParkingModel = setupParkingModel(config)
  const AssignModel = setupAssignModel(config)


	UserModel.hasMany(AssignModel)
	AssignModel.belongsTo(UserModel)

	ParkingModel.hasMany(AssignModel)
	AssignModel.belongsTo(ParkingModel)

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true })
  }

	const User = setupUser(UserModel)
	const Parking = setupParking(ParkingModel)
	const Assign = setupAssign(AssignModel, UserModel, ParkingModel)

  return {
		User,
		Parking,
		Assign
  }
}
