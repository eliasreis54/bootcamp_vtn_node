const express = require('express');
const consign = require('consign');

const app = express();

consign()
  .include('libs/config.js')
  .include('db.js')
  .then('auth.js')
  .include('libs/middlewares.js')
  .then('routes')
  .then('libs/boot.js')
  .into(app);
