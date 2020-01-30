'use strict'

const functions = require('firebase-functions');
const express = require('express');
// https://www.npmjs.com/package/body-parser
const bodyParser = require('body-parser'); // necesario para leer HTTP Post y almacenar en req.body (middelware module)
const path = require('path');

// Variables Globales
// Guia de uso de Express https://expressjs.com/es/guide/routing.html
const server = express();
server.use(bodyParser.urlencoded({
  extended: true
}));
server.use(bodyParser.json()); // para analizar json
//server.use("/imagenes",express.static(__dirname+'/imagenes')); // para poder cargar las imágenes de la carpeta
server.use("/imagenes",express.static(path.join(__dirname+'/imagenes')));

server.get('/', (req,res)=> {
  return res.json("Hola, soy un bot, pero esta no es la forma de interactuar conmigo");
})

server.post("/curso", (req,res)=>{
let contexto="nada";
let resultado="petición incorrecta";
  try {
  contexto=req.body.queryResult.action;
  resultado=`recibida petición de ${contexto}`;
  } catch(error) {
    console.log("Error contexto vacio:" + error);
  }   
  res.json(resultado);
  if(req.body.queryResult.parameters) {
    console.log("parámetros:"+req.body.queryResult.parameters);
  } else {
    console.log("Sin parámetros");
    
  }


});


const local=true;
if (local) {
  server.listen((process.env.PORT || 8000),() => {
    console.log("Servidor funcionando...");
    
  })
} else {
    exports.curso1=functions.https.onRequest(server);
}
