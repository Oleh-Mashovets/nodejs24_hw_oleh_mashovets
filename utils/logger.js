const colors = require("colors/safe");
colors.enable();

function logger(moduleName, COLORS_ENABLED = "0", LOG_LEVEL = "warn") {
  const formattedModuleName = `${moduleName}:`;

  const applyColors = (message, colorFunction) => {
    return COLORS_ENABLED === "1" ? colorFunction(message) : message;
  };

  return {
    error: (...args) =>
            console.error(
              applyColors(formattedModuleName, colors.bgRed),
              ...args
            ),
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
