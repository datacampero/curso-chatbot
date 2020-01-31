function hola(nombre) {
    console.log("Encantado de conocerte " + nombre)
}
/**
 * Crea una respuesta basica a partir de un texto
 * @param {*} textoEnviar
 *  @returns la cadena JSON de respuesta
 */
function respuestaBasica(textoEnviar) {
    let respuesta = { "fulfillmentText": textoEnviar,
        "fulfillmentMessages": [
            {
                "platform": "ACTIONS_ON_GOOGLE",
                "simpleResponses": {
                    "simpleResponses": [
                        {
                            "textToSpeech": textoEnviar
                        }
                    ]
                }
            },
            {
                "text": {
                    "text": [
                        textoEnviar
                    ]
                }
            }
        ],
    }
    return respuesta;
}

module.exports = {
    hola: hola,
    respuestaBasica: respuestaBasica
}