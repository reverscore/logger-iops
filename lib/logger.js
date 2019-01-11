/*eslint no-console: "off"*/
var environment = process.env.NODE_ENV
var winston = require('winston')
require('winston-insightops')
var util = require('util')

winston.remove(winston.transports.Console);
var ConsoleLogger = winston.transports.Console
var ConsoleOptions = {
  handleExceptions: true,
  json: false,
  colorize: true,
  prettyPrint: true,
  stringify: true,
  humanReadableUnhandledException: true
}

var InsightOpsTransport = winston.transports.InsightOpsTransport
var insightOptions = {
  token: process.env.INSIGHTOPS_TOKEN,
  region: process.env.INSIGHTOPS_REGION,
  handleExceptions: true
}

if (environment !== 'test') {
  ConsoleOptions.level = 'info'
  winston.add(ConsoleLogger, ConsoleOptions)
}

if (environment !== 'test' && environment !== 'dev') {
  winston.add(InsightOpsTransport, insightOptions)
}

var forceRemoteLogging = process.env.FORCE_REMOTE_LOGGING === true || process.env.FORCE_REMOTE_LOGGING === 'true'
if (forceRemoteLogging) {
  winston.add(InsightOpsTransport, insightOptions)
}

class Logger {
  contructor () {

  }

  setProcess (processName) {
    this.processName = processName
  }

  doLog (level, message, opts) {
    try {
      if (!this.processName) {
        throw new Error('No process name set on logger')
      }

      var msg = `(${this.processName}) - ${message}`

      if (typeof message === 'TypeError') {
        return winston.log(level, msg, opts)
      }

      if (typeof message === 'string' && !opts) {
        return winston.log(level, msg)
      }

      if (typeof message === 'string' && opts) {
        return winston.log(level, msg, util.inspect(opts))
      }

      return winston.log(level, message)
    }
    catch (err) {
      return winston.log('error', err)
    }
  }

  i (message, opts) {
    this.doLog('info', message, opts)
  }

  l (message, opts) {
    return this.i(message, opts)
  }

  log (message, opts) {
    return this.i(message, opts)
  }

  info (message, opts) {
    return this.i(message, opts)
  }

  e (message, opts) {
    this.doLog('error', message, opts)
  }

  error (message, opts) {
    return this.e(message, opts)
  }

  w (message, opts) {
    this.doLog('warn', message, opts)
  }

  warn (message, opts) {
    return this.w(message, opts)
  }

  warning (message, opts) {
    return this.w(message, opts)
  }

  d (message, opts) {
    this.doLog('debug', message, opts)
  }

  debug (message, opts) {
    return this.d(message, opts)
  }

  test (message, opts) {
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
