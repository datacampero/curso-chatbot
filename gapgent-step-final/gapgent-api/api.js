'use strict'

const debug = require('debug')('gapgent:api:routes')
const express = require('express')
const asyncify = require('express-asyncify')
const db = require('gapgent-db')
const config = require('./config')

const api = asyncify(express.Router())

let services, User, Assign, Parking

api.use('*', async (req, res, next) => {
  if (!services) {
    debug('Connecting to database')
    try {
      services = await db(config.db)
    } catch (e) {
      return next(e)
    }
    debug('Connecting to database succesful')
    
    User = services.User
    Assign = services.Assign
    Parking = services.Parking
  }
  next()
})

/**
 * @api {post} /api/free-spot
 * @apiVersion 0.1.0
 * @apiParam {String} date
 * @apiParam {String} licensePlate
 * @apiSuccessExample {json} Success response:
 * {
 *  status: 200
 *  data: {
 *    id: 1,
 *    name: 'User Name',
 *    spot: '000'   
 *  },
 *  msg: 'Free spot successfully'
 * }
 */

api.post('/free-spot', async (req, res, next) => {
  debug('a debug has come to /free-spot')
  const { date, licensePlate } = req.body
  let result
  let response = {}
  try {
    result = await Assign.findUserAndSpot(date, licensePlate)
    if (result[0] && result[0].id) {
      await  Assign.createOrUpdate({
        id: result[0].id,
        userId: null,
      })
      response = {
        status: 200,
        data: {
          id: result[0].id,
          name: result[0]['user.username'],
          spot: result[0]['parking.spot']
        },
        msg: 'Free spot successfully.'
      }
    } else {
      response = {
        status: 200,
        data: {
          id: null,
          name: null,
          spot: null
        },
        msg: 'Spot is already free.'
      }
    }
  } catch (e) {
    return next(e)
  }

  res.status(200).send(response)
})


/**
 * @api {post} /api/get-spots
 * @apiVersion 0.1.0
 * @apiParam {String} period
 * @apiSuccessExample {json} Success response:
 * {
 *  status: 200
 *  result: {
 *    id: 1,
 *    assign_date: '2019-06-11',
 *    'parking.spot': 333
 *  }
 * }
 */

api.post('/get-spots', async (req, res, next) => {
  debug('a debug has come to /get-spot')
  const { period } = req.body
  let result
  try {
    result = await Assign.findUnassigned(period)
  } catch (e) {
    return next(e)
  }
  res.status(200).send({
    status: 200,
    result
  })
})

/**
 * @api {post} /api/search-available
 * @apiVersion 0.1.0
 * @apiParam {String} spot
 * @apiParam {String} date
 * @apiSuccessExample {json} Success response:
 * {
 *  status: 200
 *  result: [{
 *    id: 1
 *  }]
 * }
 */

api.post('/search-available', async (req, res, next) => {
  debug('a debug has come to /search-available')
  const { spot, date } = req.body
  let result
  try {
    result = await Assign.findByDateAndSpot(date, spot)
  } catch (e) {
    return next(e)
  }
  res.status(200).send({
    status: 200,
    result
  })
})

/**
 * @api {post} /api/get-available-spot
 * @apiVersion 0.1.0
 * @apiParam {String} spot
 * @apiSuccessExample {json} Success response:
 * {
 *  status: 200
 *  result: [{
 *    id: 1
 *  }]
 * }
 */

api.post('/get-available-spot', async (req, res, next) => {
  debug('a debug has come to /get-available-spot')
  const { spot } = req.body
  let result
  try {
    result = await Assign.findBySpot(spot)
  } catch (e) {
    return next(e)
  }
  res.status(200).send({
    status: 200,
    result
  })
})

/**
 * @api {post} /api/get-user
 * @apiVersion 0.1.0
 * @apiParam {String} licensePlate
 * @apiSuccessExample {json} Success response:
 * {
 *  status: 200
 *  result: {
 *    id: 1,
 *    name: 'User Name'
 *  }
 * }
 */

api.post('/get-user', async (req, res, next) => {
  debug('a debug has come to /get-user')
  const { licensePlate } = req.body
  let result
  try {
    result = await User.findByLicensePlate(licensePlate)
  } catch (e) {
    return next(e)
  }
  res.status(200).send({
    status: 200,
    result
  })
})

/**
 * @api {post} /api/assign-parking
 * @apiVersion 0.1.0
 * @apiParam {String} assign_date
 * @apiParam {String} userId
 * @apiParam {String} license_plate
 * @apiParam {String} slot
 * @apiSuccessExample {json} Success response:
 * {
 *  status: 200
 *  result: {
 *    id: 842,
 *    assign_date: '2019-06-11',
 *    userId: 22,
 *    parkingId: 22,
 *    createdAt: '2019-06-11 00:00:00'
 *    updatedAt: '2019-06-11 00:00:00'
 *  }
 * }
 */

api.post('/assign-parking', async (req, res, next) => {
  debug('a debug has come to /assign-parking')
  const { assign_date, userId, license_plate, slot } = req.body
  let result
  try {
    result = await Assign.createAssignment({ assign_date, userId, license_plate, slot })
  } catch (e) {
    return next(e)
  }
  res.status(200).send({
    status: 200,
    result
  })
})

module.exports = api
