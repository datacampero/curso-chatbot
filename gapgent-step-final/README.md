# FINAL STEP

Here, we are going to import database module inside API  and create all the routes we are going to request.

### Installing gapgent-db module

Inside gapget-api folder, we are going to open [package.json](https://github.com/jegarcia28/gapgent/blob/step/final/gapgent-api/package.json) file and in dependencies key, we are going to add the following:

```
...
"dependencies": {
  ...
  "gapgent-db": "file:../gapgent-db"
},
...
```
Then we are going to execute **npm i**. This is going to genera a symlink to our gapgent-db folder inside gapgent-api/node_modules

### Create routes we are going to request

In our [api.js](https://github.com/jegarcia28/gapgent/blob/step/final/gapgent-api/api.js), we are going to have all the routes documented and an initial call that is going to generate a database connection:
```
api.use('*', async (req, res, next) => {
  if (!services) {
    debug('Connecting to database')
    try {
      services = await db(config.db)
    } catch (e) {
      return next(e)
    }
    debug('Connecting to database succesful')
    
    User = services.User
    Assign = services.Assign
    Parking = services.Parking
  }
  next()
})
```
This means that every request we send to our API, is going to execute that code and then continue with the route we requested. (As you can see, is a middleware)

### How to excecute the project?

* Create a database in MySQL with name: parking
* In a terminal, navigate to **gapgent-db** folder and execute (Remember to modify **setup.js** with your MySQL credentials):
```
npm run setup
```
* In other termina, navigate to **gapgent-web** and execute:
```
npm run start-dev
```
* In other termina, navigate to **gapgent-api** and execute:
```
npm run start-dev
```
* Download any program to expose your **gapgent-web** (I use and recommend [ngrok](https://ngrok.com/)). To use it, just download it and execute:
```
./ngrok http 8080
```
This is going to generate an https URL. Remember to copy and paste it inside dialogflow fulfillment.
* Configure Dialogflow integration with facebook messenger.
* Ask your bot to: reserve a free spot in a given date or leave your spot free for a given date.