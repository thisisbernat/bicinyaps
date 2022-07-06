// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

hbs.registerPartials(__dirname + "/views/partials");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// use session here:
require('./config/session.config')(app);

// Favicon
const favicon = require('serve-favicon')
const path = require('path')
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')))

// Router
const index = require('./routes/index');
app.use('/', index);

const authRouter = require('./routes/auth.routes');
app.use('/', authRouter);

const nyapsRouter = require('./routes/nyaps.routes');
app.use('/', nyapsRouter);

const carrilsRouter = require('./routes/carrils.routes');
app.use('/carrils', carrilsRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

