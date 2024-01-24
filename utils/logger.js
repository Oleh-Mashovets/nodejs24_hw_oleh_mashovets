function myLogger (moduleName) {
    const done = `${moduleName}:`
    return {
        error: (...args) => console.error(done, ...args),
        warn: (...args) => console.warn(done, ...args),
        info: (...args) => console.info(done, ...args),
    }
}

module.exports = myLogger;