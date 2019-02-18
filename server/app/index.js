const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const api = require('./api/index');
const port = require('./util/port');

const config = process.env.NODE_ENV === 'production' ? process.env : require('../../config/config');

const app = express();

app.disable('x-powered-by');

app.use(
  session({
    secret: config.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000, // one hour
    },
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(`${__dirname}/../../client/dist/`));

app.use('/api', api);

app.get('/exit', async () => {
  if (process.env.NODE_ENV === 'development') return;
  if (port.connected) port.disconnect();
  process.exit();
});

module.exports = app;
