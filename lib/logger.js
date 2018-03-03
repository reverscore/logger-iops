/*eslint no-console: "off"*/
var environment = process.env.NODE_ENV
var winston = require('winston')
require('winston-insightops')

winston.remove(winston.transports.Console);
var ConsoleLogger = winston.transports.Console
var ConsoleOptions = {
  handleExceptions: true,
  json: false,
  colorize: true,
  prettyPrint: false,
  stringify: false,
  humanReadableUnhandledException: true
}

var InsightOpsTransport = winston.transports.InsightOpsTransport
var insightOptions = { 
  token: process.env.INSIGHTOPTS_TOKEN, 
  region: process.env.INSIGHTOPTS_REGION
}

if (environment !== 'test') {
  ConsoleOptions.level = 'info'
  winston.add(ConsoleLogger, ConsoleOptions)
}

if (environment !== 'test' && environment !== 'dev') {
  winston.add(InsightOpsTransport, insightOptions)
}

class Logger {
  contructor() {
  }

  setProcess(processName) {
    this.processName = processName
  }

  i(message, opts) {
    if (!this.processName) {
      throw new Error('No process name set on logger')
    }

    var data = Object.assign({}, opts)
    data.process = this.processName
    winston.log('info', message, data)
  }

  l(message, opts) {
    return this.i(message, opts)
  }

  log(message, opts) {
    return this.i(message, opts)
  }

  info(message, opts) {
    return this.i(message, opts)
  }

  e(message, opts) {
    if (!this.processName) {
      throw new Error('No process name set on logger')
    }

    var data = Object.assign({}, opts)
    data.process = this.processName
    winston.log('error', message, data)
  }

  error(message, opts) {
    return this.e(message, opts)
  }

  w(message, opts) {
    if (!this.processName) {
      throw new Error('No process name set on logger')
    }

    var data = Object.assign({}, opts)
    data.process = this.processName
    winston.log('warn', message, data)
  }

  warn(message, opts) {
    return this.w(message, opts)
  }

  warning(message, opts) {
    return this.w(message, opts)
  }

  d(message, opts) {
    if (!this.processName) {
      throw new Error('No process name set on logger')
    }

    var data = Object.assign({}, opts)
    data.process = this.processName
    winston.log('debug', message, data)
  }

  debug(message, opts) {
    return this.d(message, opts)
  }

  test(message, opts) {
    if (opts) {
      console.log(message, opts)
    }
    else {
      console.log(message)
    }

    return
  }
}

module.exports = Logger
