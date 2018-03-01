/*eslint no-console: "off"*/
var environment = process.env.NODE_ENV
var INSIGHTOPTS_TOKEN = process.env.INSIGHTOPTS_TOKEN
var INSIGHTOPTS_REGION = process.env.INSIGHTOPTS_REGION
var Insight = require('r7insight_node')
var iLogger = new Insight({ 
  token: INSIGHTOPTS_TOKEN, 
  region: INSIGHTOPTS_REGION
})

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
    iLogger.log('info', message, opts)
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
    iLogger.log('err', message, opts)
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
    iLogger.log('warning', message, opts)
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
    iLogger.log('debug', message, opts)
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
