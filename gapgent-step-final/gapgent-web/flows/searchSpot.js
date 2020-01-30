'use strict'

const Parking = require('../class')
const parking = new Parking()

module.exports = async function (req, res, next) {
    const date = (typeof req.body.queryResult.outputContexts[0].parameters.date !== 'undefined') ? req.body.queryResult.outputContexts[0].parameters.date : ''
    const datePeriod = (typeof req.body.queryResult.outputContexts[0].parameters.datePeriod !== 'undefined') ? req.body.queryResult.outputContexts[0].parameters.datePeriod : ''

    let resp = []
    let quickReplies = []
    let msg = ""
    let texts = [`These are the following parking lots avaiable:`]
    let ctx = []
    let request
    let period

    if (date !== '') {
        period = {
            startDate: date,
            endDate: date
        }
    } else if (datePeriod !== '') {
        period = {
            startDate: datePeriod.startDate,
            endDate: datePeriod.endDate
        }
    }

    if (period) {
        request = await parking.sendRequest('POST', {
            period
        }, 'get-spots')

        if (request.status ===  200) {
            if (request.result.length > 0) {
                ctx.push({ name: `${req.body.session}/contexts/search-slot`, lifespanCount: 5, parameters: { date, datePeriod } })
                ctx.push({ name: `${req.body.session}/contexts/confirm`, lifespanCount: 5, parameters: { date, datePeriod } })
                msg = `These are the following parking lots avaiable:`
                for (let i = 0; i < request.result.length; i++) {
                    texts.push(`- ${parking.parseDates(request.result[i].assign_date)}: ${request.result[i]['parking.spot']}`)
                    quickReplies.push(request.result[i]['parking.spot'])
                }
                resp.push({
                    text: { 
                        text:  texts
                    },
                    platform: 'FACEBOOK'
                })
                //If you want to send buttons (quick replies) to the user, just use the following code.
                resp.push({
                    quickReplies: {
                    title: 'Do you want to reserve a parking lot?',
                    quickReplies
                    },
                    platform: 'FACEBOOK'
                })
            } else {
                resp.push({
                    text: { 
                        text:  [`There are no spot avialable for the date you requested. Can I help you with anything else?`]
                    },
                    platform: 'FACEBOOK'
                })
            }
        }
    }

    return res.status(200).json({
		fulfillmentText: msg,
        fulfillmentMessages: resp,
		outputContexts: ctx
	})
}