require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const { PORT, DATABASE_URL, CLIENT_ORIGIN } = require('./config')


// Serve static assets if any
app.use(express.static('public'))
// Logs requests to console
app.use(morgan('common'))

//CORS
app.use(
  cors()
)

// ROUTES
const taskRouter = require('./routers/api-task-router')
app.use('/api/tasks', taskRouter)

// SERVER SETUP
let server

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      { useNewUrlParser: true },
      err => {
        if (err) {
          return reject(err)
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`)
            resolve()
          })
          .on('error', err => {
            mongoose.disconnect()
            reject(err)
          })
      }
    )
  })
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server')
      server.close(err => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  })
}

// Checks if module is the entry script, if it is, runServer
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.log(err))
}

module.exports = { app, runServer, closeServer }
