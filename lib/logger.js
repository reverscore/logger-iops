/*eslint no-console: "off"*/
const httpContext = require('express-http-context');
const environment = process.env.NODE_ENV;
const winston = require('winston');
require('winston-insightops');
const path = require('path');
const util = require('util');

winston.remove(winston.transports.Console);
const ConsoleLogger = winston.transports.Console;
const ConsoleOptions = {
  handleExceptions: true,
  json: false,
  colorize: true,
  prettyPrint: true,
  stringify: true,
  humanReadableUnhandledException: true,
};

const InsightOpsTransport = winston.transports.InsightOpsTransport;
const insightOptions = {
  token: process.env.INSIGHTOPS_TOKEN,
  region: process.env.INSIGHTOPS_REGION,
  handleExceptions: true,
};

if (environment !== 'test') {
  ConsoleOptions.level = 'info';
  winston.add(ConsoleLogger, ConsoleOptions);
}

if (environment !== 'test' && environment !== 'dev') {
  winston.add(InsightOpsTransport, insightOptions);
}

class Logger {
  contructor() {}

  setProcess(processName) {
    this.processName = processName;
  }

  setFilename(filename) {
    this.processName = path.basename(filename);
  }

  setMethodProcess(methodName) {
    if (!this.classProcessName) {
      this.classProcessName = this.processName;
    }
    const methodNameCapitalized =
      methodName.charAt(0).toUpperCase() + methodName.slice(1);
    this.setProcess(
      `${this.classProcessName}) (methods:${methodNameCapitalized}`,
    );
  }

  setLogId(logId) {
    this.createContext();
    httpContext.set('logId', logId);
  }

  getLogId() {
    return httpContext.get('logId');
  }

  setUserId(userId) {
    this.createContext();
    httpContext.set('userId', userId);
  }

  getUserId() {
    return httpContext.get('userId');
  }

  initMiddleware() {
    return httpContext.middleware;
  }

  createContext() {
    if (!httpContext.ns.active) {
      let context = httpContext.ns.createContext();
      httpContext.ns.context = context;
      httpContext.ns.active = context;
      return httpContext.ns;
    }
  }

  doLog(level, message, opts) {
    try {
      const logId = this.getLogId() || null;
      const userId = this.getUserId('userId') || null;

      if (!this.processName) {
        throw new Error('No process name set on logger');
      }

      let msg = '';
      if (logId) msg = `${msg} [@logId:${logId}]`;
      if (userId) msg = `${msg} [@userId:${userId}]`;
      msg = `${msg} [${this.processName}] - ${message}`;

      if (typeof message === 'TypeError') {
        return winston.log(level, msg, opts);
      }

      if (typeof message === 'string' && !opts) {
        return winston.log(level, msg);
      }

      if (typeof message === 'string' && opts) {
        return winston.log(level, msg, util.inspect(opts));
      }

      return winston.log(level, message);
    } catch (err) {
      return winston.log('error', err);
    }
  }

  i(message, opts) {
    this.doLog('info', message, opts);
  }

  l(message, opts) {
    return this.i(message, opts);
  }

  log(message, opts) {
    return this.i(message, opts);
  }

  info(message, opts) {
    return this.i(message, opts);
  }

  e(message, opts) {
    this.doLog('error', message, opts);
  }

  error(message, opts) {
    return this.e(message, opts);
  }

  w(message, opts) {
    this.doLog('warn', message, opts);
  }

  warn(message, opts) {
    return this.w(message, opts);
  }

  warning(message, opts) {
    return this.w(message, opts);
  }

  d(message, opts) {
    this.doLog('debug', message, opts);
  }

  debug(message, opts) {
    return this.d(message, opts);
  }

  test(message, opts) {
    if (opts) {
      console.log(message, opts);
    } else {
      console.log(message);
    }

    return;
  }
}

module.exports = Logger;
