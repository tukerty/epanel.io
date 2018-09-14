'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner_build = ora({
  text: 'Building deployment...',
  color: 'green'
}).start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) {
    spinner_build.fail('Build failed')
    throw err
  }

  webpack(webpackConfig, (err, stats) => {
    spinner_build.succeed('Build complete')
    
    const spinner_check = ora({
      text: 'Checking assets for errors...',
      color: 'green'
    }).start()

    if (err || stats.hasErrors()) {
      spinner_check.fail('Assets error')
      throw err
    }

    spinner_check.succeed('Assets check complete')

    /* 
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n'
    )) */
  })
})
