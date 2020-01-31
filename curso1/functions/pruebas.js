'use strict'

const DBVDialogLib = require("./DBVDialogLib");
DBVDialogLib.hola('David');
DBVDialogLib.hola('Juan');
DBVDialogLib.hola('Pepe');

let respuesta = DBVDialogLib.respuestaBasica("Bienvenido a URBOT")
console.log(respuesta)
console.log(JSON.stringify(respuesta));
