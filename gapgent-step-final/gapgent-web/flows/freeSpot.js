'use strict'

const Parking = require('../class')
const parking = new Parking()

module.exports = async function (req, res, next) {
    //Get parameters from dialogflow
    const date = (typeof req.body.queryResult.outputContexts[0].parameters.date !== 'undefined') ? req.body.queryResult.outputContexts[0].parameters.date : ''
    const licensePlate = (typeof req.body.queryResult.outputContexts[0].parameters.licensePlate !== 'undefined') ? req.body.queryResult.outputContexts[0].parameters.licensePlate : ''
    let resp = []
    let msg = ""
    let ctx = []
    let request

    //Validate mandatory fields
    if (date === '') {
        //Every time I'm moving into another validation, means that is another intent, so I send the context of the next conversation flow
        ctx.push({ name: `${req.body.session}/contexts/license-plate`, lifespanCount: 5, parameters: { date: '', licensePlate: '' } })
        ctx.push({ name: `${req.body.session}/contexts/free-spot`, lifespanCount: 5, parameters: { date: '', licensePlate: '' } })
        //Messages that are going to be displayed in facebook messenger, the most important is resp array.
        msg = `When do you want to leave your parking spot free?`
        resp.push({ text:{ text: [ `When do you want to leave your parking spot free?` ] } })
    } else if (licensePlate === '') {
        ctx.push({ name: `${req.body.session}/contexts/license-plate`, lifespanCount: 5, parameters: { date, licensePlate: '' } })
        ctx.push({ name: `${req.body.session}/contexts/free-spot`, lifespanCount: 5, parameters: { date, licensePlate: '' } })
        msg = `What is the license plate number of you car?`
        resp.push({ text:{ text: [ `What is the license plate number of you car?` ] } })        
    } else {
        //Send request to my API so I can update assigned spots
        request = await parking.sendRequest('POST', {
            date, licensePlate
        }, 'free-spot')
        if (request.status === 200) {
            ctx.push({ name: `${req.body.session}/contexts/license-plate`, lifespanCount: 0, parameters: { date, licensePlate } })
            ctx.push({ name: `${req.body.session}/contexts/free-spot`, lifespanCount: 0, parameters: { date, licensePlate } })
            if(request.data.id !== null) {
                msg = `Ok ${request.data.name}. Your spot number: ${request.data.spot} its going to be free for today. Can I help you with anything else?`
                resp.push({ text:{ text: [ `Ok ${request.data.name}. Your spot number: ${request.data.spot} its going to be free for today. Can I help you with anything else?` ] } })
            } else {
                msg = `Your spot its already free for the date you wrote. Can I help you with anything else?`
                resp.push({ text:{ text: [ `Your spot its already free for date you wrote. Can I help you with anything else?` ] } })
            }
        } else {
            ctx.push({ name: `${req.body.session}/contexts/license-plate`, lifespanCount: 0, parameters: { date, licensePlate: '' } })
            ctx.push({ name: `${req.body.session}/contexts/free-spot`, lifespanCount: 0, parameters: { date, licensePlate: '' } })
            msg = `Sorry, there was an error while handling your request. Can you please repeat your license plate number?`
            resp.push({ text:{ text: [ `Sorry, there was an error while handling your request. Can you please repeat your license plate number?` ] } })
        }
    }

    return res.status(200).json({
		fulfillmentText: msg,
        fulfillmentMessages: resp,
		outputContexts: ctx
	})
}