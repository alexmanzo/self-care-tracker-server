const express = require("express")
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const { PORT, DATABASE_URL, CLIENT_ORIGIN } = require('./config')

mongoose.Promise = global.Promise
app.use(express.static('public'))
app.use(morgan('common'))

//CORS
app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
)

// ROUTES
const bathroomRouter = require('./routers/api-bathroom-router')
app.use('/api/bathrooms', bathroomRouter)

// app.get("/api/*", (req, res) => {
//   res.json({ ok: true })
// })

// SERVER SETUP
let server;

function runServer(databaseUrl, port = PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, { useNewUrlParser: true }, err => {
			if (err) {
				return reject(err)
			}
		server = app.listen(port, () => {
			console.log(`Your app is listening on port ${port}`)
			resolve()
		})
		.on('error', err => {
			mongoose.disconnect()
			reject(err)
		})	
		})
	})
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
	runServer(DATABASE_URL).catch(err => console.log(error(err)))
}

module.exports = { app, runServer, closeServer }

