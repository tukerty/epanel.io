'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_PORT: 3000,
  ROOT_API: '"http://127.0.0.1:3000/api"',
  ROOT_WS: '"http://127.0.0.1:3000"'
})
