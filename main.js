const config = require('config');

const fs = require('fs');

const fileSync = require('./file_sync');
fileSync.start();

const COLORS_ENABLED = config.get('COLORS_ENABLED');
const LOG_LEVEL = config.get('LOG_LEVEL');

const logger = require('./utils/logger')('main', COLORS_ENABLED, LOG_LEVEL);

// logger.info('the script is running!');
// logger.warn('the script is running with warning!');
// logger.error('the script is running with error!');


fs.writeFileSync('./source/file_1', "First string");
fs.writeFileSync('./source/file_2', "First string");
fs.writeFileSync('./target/file_2', "First string");

fs.mkdirSync('./source/dir_1', {recursive: true});
fs.writeFileSync('./source/dir_1/file_3', "First string");


