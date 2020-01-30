'use strict'

const http = require('http')
const express = require('express')
const asyncify = require('express-asyncify')
const bodyParser = require('body-parser')
const debug = require('debug')('gapgent:web')
const chalk = require('chalk')
const proxy = require('./proxy')

const app = asyncify(express())
const port = process.env.PORT || 8080
const server = http.createServer(app)

//Middlewares to handle responses from rest API in JSON format
app.use(bodyParser.json({limit: "100mb", type:'application/json'}));
app.use(bodyParser.urlencoded({limit: "100mb", extended: true, parameterLimit:52428800}));
app.use('/proxy', proxy)

//Middleware that is going to be triggered everytime that an error occurs
app.use((err, req, res, next) => {
  debug(`Error ${err.message}`)
  if (err.message.match(/not found/)) {
    return res.status(404).send({error: err.message})
  }
  res.status(500).send({error: err.message})
})

//Function to handle unknown errors in node
function handleFatalError (err) {
  console.log(`${chalk.red('[fatal error]')} ${err.message}`)
  console.log(err.stack)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

//Setup server in configured port.
server.listen(port, () => {
  console.log(`$${chalk.green('[parking-web]')} server listening on port 8080`)
})
