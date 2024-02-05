const config = require('config');
const fs = require('fs').promises;
const path = require('path');
const logger = require('./utils/logger')('file_sync', config.COLORS_ENABLED, config.LOG_LEVEL);

async function copyFiles(sourcePath, targetPath) {
    try {
        const files = await fs.readdir(sourcePath);

        for (const file of files) {
            const sourceFilePath = path.join(sourcePath, file);
            const targetFilePath = path.join(targetPath, file);

            try {
                const sourceStats = await fs.stat(sourceFilePath);

                if (sourceStats.isDirectory()) {
                    await fs.mkdir(targetFilePath, { recursive: true });
                    await copyFiles(sourceFilePath, targetFilePath);
                } else {
                    const targetStats = await fs.stat(targetFilePath).catch(() => null);

                    if (targetStats) {
                        logger.warn(`File already exists in target: ${sourceFilePath}`);
                    } else {
                        await fs.copyFile(sourceFilePath, targetFilePath);
                        logger.info(`Copying was successful: ${sourceFilePath}`);
                    }
                }
            } catch (err) {
                logger.error(`Error processing file: ${sourceFilePath}, ${err}`);
            }
        }
    } catch (err) {
        logger.error(`Error reading source directory: ${sourcePath}, ${err}`);
    }
}

module.exports = {
    start: async function () {
        const sourcePath = './Source';
        const targetPath = './Target';

        await fs.mkdir(sourcePath, { recursive: true }).catch(() => {});
        await fs.mkdir(targetPath, { recursive: true }).catch(() => {});

        await copyFiles(sourcePath, targetPath);
    },
};