require('dotenv').config();
const config = require('config');

const COLORS_ENABLED = config.get('COLORS_ENABLED');
const LOG_LEVEL = config.get('LOG_LEVEL');

console.log('COLORS_ENABLED:', COLORS_ENABLED);
console.log('LOG_LEVEL:', LOG_LEVEL);

const logger = require('./utils/logger')('main', COLORS_ENABLED, LOG_LEVEL);

logger.info('the script is running!');
logger.warn('the script is running with warning!');
logger.error('the script is running with error!');
