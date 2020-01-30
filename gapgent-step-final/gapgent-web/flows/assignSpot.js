'use strict'

const Parking = require('../class')
const parking = new Parking()

module.exports = async function (req, res, next) {
    const date = (typeof req.body.queryResult.outputContexts[0].parameters.date !== 'undefined') ? req.body.queryResult.outputContexts[0].parameters.date : ''
    const datePeriod = (typeof req.body.queryResult.outputContexts[0].parameters.datePeriod !== 'undefined') ? req.body.queryResult.outputContexts[0].parameters.datePeriod : ''
    const spot = (typeof req.body.queryResult.outputContexts[0].parameters.spot !== 'undefined') ? req.body.queryResult.outputContexts[0].parameters.spot : ''
    const licensePlate = (typeof req.body.queryResult.outputContexts[0].parameters.licensePlate !== 'undefined') ? req.body.queryResult.outputContexts[0].parameters.licensePlate : ''
    let reservationDate = (typeof req.body.queryResult.outputContexts[0].parameters.reservationDate !== 'undefined') ? req.body.queryResult.outputContexts[0].parameters.reservationDate : ''
    let resp = []
    let msg = ""
    let ctx = []
    let request
    if (date !== '') reservationDate = date

    if (spot !== '') {
        if (reservationDate !== '') {
            if (licensePlate !== '') {
                request = await parking.sendRequest('POST', {
                    licensePlate
                }, 'get-user')
                if (request.status === 200) {
                    if (request.result && request.result.id) {
                        console.log("ReservationDate-->", reservationDate)
                        await parking.sendRequest('POST', {
                            assign_date: reservationDate,
                            userId: request.result.id,
                            license_plate: licensePlate,
                            slot: spot
                        }, 'assign-parking')
                        ctx.push({ name: `${req.body.session}/contexts/search-slot`, lifespanCount: 0, parameters: { date, datePeriod, spot, reservationDate } })
                        ctx.push({ name: `${req.body.session}/contexts/assign-spot`, lifespanCount: 0, parameters: { date, datePeriod, spot, reservationDate } })
                        ctx.push({ name: `${req.body.session}/contexts/license-plate`, lifespanCount: 0, parameters: { date, datePeriod, spot, reservationDate } })
                        msg = `${request.result.name}, The reservation for ${parking.parseDates(reservationDate)} - spot: ${spot}, was done successfully`
                        resp.push({ text:{ text: [ `${request.result.name}, The reservation for ${parking.parseDates(reservationDate)} - spot: ${spot}, was done successfully.` ] } })
                    } else {
                        ctx.push({ name: `${req.body.session}/contexts/search-slot`, lifespanCount: 5, parameters: { date, datePeriod, spot, reservationDate } })
                        ctx.push({ name: `${req.body.session}/contexts/assign-spot`, lifespanCount: 5, parameters: { date, datePeriod, spot, reservationDate } })
                        ctx.push({ name: `${req.body.session}/contexts/license-plate`, lifespanCount: 5, parameters: { date, datePeriod, spot, reservationDate } })
                        msg = `The license plate number you wrote is not register in the system. Please check and write it again.`
                        resp.push({ text:{ text: [ `The license plate number you wrote is not register in the system. Please check and write it again.` ] } })
                    }
                }
            } else {
                ctx.push({ name: `${req.body.session}/contexts/search-slot`, lifespanCount: 5, parameters: { date, datePeriod, spot, reservationDate } })
                ctx.push({ name: `${req.body.session}/contexts/assign-spot`, lifespanCount: 5, parameters: { date, datePeriod, spot, reservationDate } })
                request = await parking.sendRequest('POST', {
                    spot,
                    date: reservationDate
                }, 'search-available')
                if (request.status === 200) {
                    if (request.result.length > 0) {
                        ctx.push({ name: `${req.body.session}/contexts/license-plate`, lifespanCount: 5, parameters: { date, datePeriod, spot, reservationDate } })
                        msg = `Please tell me your license plate number so I can finish your reservation`
                        resp.push({ text:{ text: [ `Please tell me your license plate number so I can finish your reservation` ] } })
                    } else {
                        ctx.push({ name: `${req.body.session}/contexts/reservation-day`, lifespanCount: 5, parameters: { date, datePeriod, spot, reservationDate: '' } })
                        msg = `The date you told me is not available, please write another`
                        resp.push({ text:{ text: [ `The date you told me is not available, please write another` ] } })
                    }
                }
            }
        } else {
            ctx.push({ name: `${req.body.session}/contexts/search-slot`, lifespanCount: 5, parameters: { date, datePeriod, spot } })
            request = await parking.sendRequest('POST', {
                spot
            }, 'get-available-spot')
            if(request.status === 200) {
                if (request.result.length > 0) {
                    ctx.push({ name: `${req.body.session}/contexts/assign-spot`, lifespanCount: 5, parameters: { date, datePeriod, spot } })
                    ctx.push({ name: `${req.body.session}/contexts/reservation-day `, lifespanCount: 5, parameters: { date, datePeriod, spot } })
                    msg = `Which date do you want to reserve the parking lot?`
                    resp.push({ text:{ text: [ `Which date do you want to reserve the parking lot?` ] } })
                } else {
                    ctx.push({ name: `${req.body.session}/contexts/confirm`, lifespanCount: 5, parameters: { date, datePeriod } })
                    msg = `The parking lot number you told me is not available. Please write another.`
                    resp.push({ text:{ text: [ `The parking lot number you told me is not available. Please write another.` ] } })
                }
            }
        }
    } else {
        ctx.push({ name: `${req.body.session}/contexts/search-slot`, lifespanCount: 5, parameters: { date, datePeriod } })
        ctx.push({ name: `${req.body.session}/contexts/confirm`, lifespanCount: 5, parameters: { date, datePeriod } })
        msg = `Please tell me which parking lot do you want to reserve`
        resp.push({ text:{ text: [ `Please tell me which parking lot do you want to reserve` ] } })
    }

    return res.status(200).json({
		fulfillmentText: msg,
        fulfillmentMessages: resp,
		outputContexts: ctx
	})
}