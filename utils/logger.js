const config = require('config');
const fs = require('fs');
const path = require('path');

const colors = require("colors/safe");
colors.enable();

const LOG_FOLDER = 'logs';

function createLogFolder() {
  if (!fs.existsSync(LOG_FOLDER)) {
    fs.mkdirSync(LOG_FOLDER);
  }
}

function createLogStreams() {
  const infoLogStream = fs.createWriteStream(path.join(LOG_FOLDER, 'info.log'), { flags: 'a' });
  const errorLogStream = fs.createWriteStream(path.join(LOG_FOLDER, 'errors.log'), { flags: 'a' });
  return { infoLogStream, errorLogStream };
}

function logger(moduleName, COLORS_ENABLED = "0", LOG_LEVEL_ARG = "warn") {
  createLogFolder();
  const { infoLogStream, errorLogStream } = createLogStreams();
  const formattedModuleName = `${moduleName}:`;

  function logToFile(level, message) {
    const logEntry = `[${new Date().toISOString()}] ${moduleName} ${level.toUpperCase()}: ${message}\n`;
    if (level === 'info') {
      infoLogStream.write(logEntry);
    } else {
      errorLogStream.write(logEntry);
    }
  }

  const LOG_LEVEL = config.get('LOG_LEVEL') || LOG_LEVEL_ARG;

  const applyColors = (message, colorFunction) => {
    return COLORS_ENABLED === "1" ? colorFunction(message) : message;
  };

  return {
    error: (...args) => {
      const message = applyColors(formattedModuleName, colors.bgRed) + args.join(' ');
      if (LOG_LEVEL === "error") {
        console.error(message);
      }
      logToFile('error', message);
    },
    info: (...args) => {
      const message = applyColors(formattedModuleName, colors.bgCyan) + args.join(' ');
      if (LOG_LEVEL === "info") {
        console.log(message);
      }
      logToFile('info', message);
    },
    warn: (...args) => {
      const message = applyColors(formattedModuleName, colors.bgYellow) + args.join(' ');
      if (LOG_LEVEL === "warn") {
        console.warn(message);
      }
      logToFile('warn', message);
    }
  };
}

module.exports = logger;