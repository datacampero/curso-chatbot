'use strict'

//Creacion de JSON
let valor = { "nombre": "Alejandro", "apellidos": "Marcano" };
console.log("valor=" + valor);
console.log("valor str=" + JSON.stringify(valor));
console.log("valor=" + valor.nombre + " " + valor.apellidos);

let valor2 = `{"nombre": "Alejandro", "apellidos": "Marca"}`;
console.log(valor2)
let valor2json = JSON.parse(valor2);
console.log(valor2json)
console.log("valor2json=" + valor2json.nombre + " " + valor2json.apellidos);


let vector = [{ "nombre": "Alejandro", "apellidos": "Marcano" }, { "nombre": "Luis", "apellidos": "Portal" }]
console.log(vector)

for (let i = 0; i < vector.length; i++) {
    console.log(vector[i].nombre + " " + vector[i].apellidos);

}

let req = {
    "responseId": "c4b863dd-aafe-41ad-a115-91736b665cb9",
    "queryResult": {
        "queryText": "GOOGLE_ASSISTANT_WELCOME",
        "action": "input.welcome",
        "parameters": {},
        "allRequiredParamsPresent": true,
        "fulfillmentText": "",
        "fulfillmentMessages": [],
        "outputContexts": [
            {
                "name": "projects/${PROJECTID}/agent/sessions/${SESSIONID}/contexts/google_assistant_welcome"
            },
            {
                "name": "projects/${PROJECTID}/agent/sessions/${SESSIONID}/contexts/actions_capability_screen_output"
            },
            {
                "name": "projects/${PROJECTID}/agent/sessions/${SESSIONID}/contexts/google_assistant_input_type_voice"
            },
            {
                "name": "projects/${PROJECTID}/agent/sessions/${SESSIONID}/contexts/actions_capability_audio_output"
            },
            {
                "name": "projects/${PROJECTID}/agent/sessions/${SESSIONID}/contexts/actions_capability_web_browser"
            },
            {
                "name": "projects/${PROJECTID}/agent/sessions/${SESSIONID}/contexts/actions_capability_media_response_audio"
            }
        ],
        "intent": {
            "name": "projects/${PROJECTID}/agent/intents/8b006880-0af7-4ec9-a4c3-1cc503ea8260",
            "displayName": "Default Welcome Intent"
        },
        "intentDetectionConfidence": 1,
        "diagnosticInfo": {},
        "languageCode": "en-us"
    },
    "originalDetectIntentRequest": {
        "source": "google",
        "version": "2",
        "payload": {
            "isInSandbox": true,
            "surface": {
                "capabilities": [
                    {
                        "name": "actions.capability.SCREEN_OUTPUT"
                    },
                    {
                        "name": "actions.capability.AUDIO_OUTPUT"
                    },
                    {
                        "name": "actions.capability.WEB_BROWSER"
                    },
                    {
                        "name": "actions.capability.MEDIA_RESPONSE_AUDIO"
                    }
                ]
            },
            "inputs": [
                {
                    "rawInputs": [
                        {
                            "query": "Talk to my test app",
                            "inputType": "VOICE"
                        }
                    ],
                    "intent": "actions.intent.MAIN"
                }
            ],
            "user": {
                "lastSeen": "2018-03-16T22:08:48Z",
                "permissions": [
                    "UPDATE"
                ],
                "locale": "en-US",
                "userId": "ABwppHEvwoXs18xBNzumk18p5h02bhRDp_riW0kTZKYdxB6-LfP3BJRjgPjHf1xqy1lxqS2uL8Z36gT6JLXSrSCZ"
            },
            "conversation": {
                "conversationId": "${SESSIONID}",
                "type": "NEW"
            },
            "availableSurfaces": [
                {
                    "capabilities": [
                        {
                            "name": "actions.capability.SCREEN_OUTPUT"
                        },
                        {
                            "name": "actions.capability.AUDIO_OUTPUT"
                        }
                    ]
                }
            ]
        }
    },
    "session": "projects/${PROJECTID}/agent/sessions/${SESSIONID}"
}


console.log("Action" + req.queryResult.action);
console.log("Parametros" + req.queryResult.parameters);
console.log("ResponseId" + req.responseId);

//Respuesta que hay que generar
let respuesta = {
    "responseId": "ea906ec9-403f-4025-a50c-0d08b913143c-426bc00a",
    "queryResult": {
        "queryText": "hola",
        "action": "input.welcome",
        "parameters": {},
        "allRequiredParamsPresent": true,
        "fulfillmentText": "¡Buenos días!",
        "fulfillmentMessages": [
            {
                "text": {
                    "text": [
                        "¡Buenos días!"
                    ]
                }
            }
        ],
        "intent": {
            "name": "projects/curso1-abtmap/agent/intents/f7b5847a-2024-4e90-816b-966f5a3df087",
            "displayName": "Default Welcome Intent"
        },
        "intentDetectionConfidence": 1,
        "languageCode": "es"
    }
}

//Setear un variable del JSON respuesta
console.log(respuesta)
respuesta.queryResult.fulfillmentText = "Buenas Tardes"
console.log("DESPUES DEL CAMBIO")

console.log(respuesta)

//Añadir nuevos elementos al objeto desde codigo dentro del array fulfillmentMessages
respuesta.queryResult.fulfillmentMessages.push(
    {
        "platform": "ACTIONS_ON_GOOGLE",
        "suggestions": {
            "suggestions": [
                {
                    "title": "Chiste"
                },
                {
                    "title": "Consejo"
                },
                {
                    "title": "Noticias"
                }
            ]
        }
    },

)
console.log("Insertado sugerencia")

console.log(respuesta)
//Como lo vemos como objeto, vamos a verlo como string
console.log(JSON.stringify(respuesta));





