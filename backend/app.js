// backend/app.js
const routes = require('./routes');

const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production'; // will return 'true' if env is in production

const app = express(); // initialize express

app.use(morgan('dev'));  // connect middleware to log info abt req & res

app.use(cookieParser()); // middleware to parse cookies
app.use(express.json());  // middleware to parse JSON bodies of req w/ Content-Type of 'application/json'

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }
  
  // helmet helps set a variety of headers to better secure your app
  app.use(
    helmet.crossOriginResourcePolicy({
      policy: "cross-origin"
    })
  );
  
  // Set the _csrf token and create req.csrfToken method
  app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
  );

  app.use(routes); // Connect all the routes



  


  /* ************** */
  module.exports = app;