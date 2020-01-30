'use strict'

const request = require('request-promise-native')
const { endpoint } = require('../config')

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

class Parking {
	async sendRequest(method, body, action) {
        const options = {
            method,
            url: `${endpoint}/${action}`,
            body,
            json: true
        }
        let response
        try {
            response = await request(options)
        } catch (e) {
            console.log("Error saving in DB--->", e)
        }
        return response
    }

    parseDates(d) {
        const parsingDate = new Date(d)
        const date = parsingDate.getUTCDate()
        const day = parsingDate.getUTCDay()
        const month = parsingDate.getMonth()
        const year = parsingDate.getFullYear()

        return `${days[day]} ${months[month]} ${date} ${year}`
    }

}

module.exports = Parking
