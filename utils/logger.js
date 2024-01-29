const colors = require("colors/safe");
colors.enable();

function logger(moduleName, COLORS_ENABLED = "0", LOG_LEVEL_ARG = "warn") {
  const formattedModuleName = `${moduleName}:`;
  const LOG_LEVEL = process.env.LOG_LEVEL || LOG_LEVEL_ARG;

  const applyColors = (message, colorFunction) => {
    return COLORS_ENABLED === "1" ? colorFunction(message) : message;
  };

  return {
    error:
      (LOG_LEVEL === "error" || LOG_LEVEL === "warn" || LOG_LEVEL === "info")
        ? (...args) =>
            console.error(
              applyColors(formattedModuleName, colors.bgRed),
              ...args
            )
        : () => {},
    warn:
      (LOG_LEVEL === "warn" || LOG_LEVEL === "info")
        ? (...args) =>
            console.warn(
              applyColors(formattedModuleName, colors.bgYellow),
              ...args
            )
        : () => {},
    info:
      LOG_LEVEL === "info"
        ? (...args) =>
            console.info(
              applyColors(formattedModuleName, colors.bgCyan),
              ...args
            )
        : () => {},
  };
}

module.exports = logger;
