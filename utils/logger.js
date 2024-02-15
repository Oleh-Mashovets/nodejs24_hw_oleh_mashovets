//logger

const config = require('config');
const fs = require('fs');

const colors = require("colors/safe");
colors.enable();

function createFolder() {
  const folderPath = './logs';
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
}

function createStream() {
  createFolder();
  const infoLogStream = fs.createWriteStream('./logs/info.log', { flags: 'a' });
  const errorLogStream = fs.createWriteStream('./logs/errors.log', { flags: 'a' });
  return { infoLogStream, errorLogStream };
}

function logger(moduleName, COLORS_ENABLED = "0", LOG_LEVEL_ARG = "warn") {
  const { infoLogStream, errorLogStream } = createStream();
  const formattedModuleName = `${moduleName}:`;

  function logToFile(level, args) {
    const logEntry = `[${new Date().toISOString()}] ${moduleName} ${level.toUpperCase()}: ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}\n`;
    if (level === 'info') {
      infoLogStream.write(logEntry);
    } else if (level === 'warn' || level === 'error') {
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
      logToFile('error', args);
    },
    info: (...args) => {
      const message = applyColors(formattedModuleName, colors.bgCyan) + args.join(' ');
      if (LOG_LEVEL === "info") {
        console.log(message);
      }
      logToFile('info', args);
    },
    warn: (...args) => {
      const message = applyColors(formattedModuleName, colors.bgYellow) + args.join(' ');
      if (LOG_LEVEL === "warn") {
        console.warn(message);
      }
      logToFile('warn', args);
    }
  };
}

module.exports = logger;