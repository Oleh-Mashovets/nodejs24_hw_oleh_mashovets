function myLogger (moduleName) {
    return {
        error: (...args) => console.error(moduleName, ...args),
        warn: (...args) => console.warn(moduleName, ...args),
        info: (...args) => console.info(moduleName, ...args),
    }
}

module.exports = {
    myLogger
}