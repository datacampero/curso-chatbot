'use strict'

const express = require('express')
const asyncify = require('express-asyncify')

//Import flows
const searchSpot = require('./flows/searchSpot')
const freeSpot = require('./flows/freeSpot')
const assignSpot = require('./flows/assignSpot')

const api = asyncify(express.Router())

//Create a POST request so dialogflow can send you the information of the current conversation
api.post('/gapgent', (req, res, next) => {
  const action = req.body.queryResult.action
  switch (action) {
      case 'search-spot':
          searchSpot(req, res, next)
      break;
      case 'free-spot':
          freeSpot(req, res, next)
      break;
      case 'assign-spot':
          assignSpot(req, res, next)
      break;
  }
})


module.exports = api
