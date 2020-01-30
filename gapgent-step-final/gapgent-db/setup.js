'use strict'

const debug = require('debug')('gapgent-db:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const minimist = require('minimist')
const db = require('./')

const args = minimist(process.argv)
const prompt = inquirer.createPromptModule()
async function setup () {
  if (!args.yes) {
    const answer = await prompt([
      {
        type: 'confirm',
        name: 'setup',
        message: 'This will destroy database, are you sure?'
      }
    ])

    if (!answer.setup) {
      return console.log('Nothing happened')
    }
  }
  const config = {
    database: process.env.DB_NAME || 'parking',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PWD || 'toby3030',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: s => debug(s),
    setup: true,
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  }

  await db(config).catch(handleFatalError)

  console.log('success: ')
  process.exit(0)
}

function handleFatalError (error) {
  console.log(`${chalk.red('[Fatal error]')} ${error.message}`)
  console.log(error.stack)
  process.exit(1)
}

setup()
