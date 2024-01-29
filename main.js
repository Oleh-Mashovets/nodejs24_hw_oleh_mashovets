require('dotenv').config();
const config = require('./utils/config/default');

const COLORS_ENABLED = process.env.COLORS_ENABLED || config.COLORS_ENABLED;
const LOG_LEVEL = process.env.LOG_LEVEL || config.LOG_LEVEL;

console.log('COLORS_ENABLED:', COLORS_ENABLED);
console.log('LOG:', LOG_LEVEL);

const logger = require('./utils/logger')('main', COLORS_ENABLED, LOG_LEVEL);

logger.info('the script is running!');
logger.warn('the script is running with warning!');
logger.error('the script is running with error!');