require('dotenv').config();
const ALLOWED_STORAGE_TYPES = ['array'];
const storageType = process.env.STORAGE_TYPE;

module.exports = {
    LOG_LEVEL: process.env.LOG_LEVEL || 'warn',
    COLORS_ENABLED: process.env.COLORS_ENABLED || '0',
    server: {
        port: process.env.PORT || 3000
    },
    // storage: {
    //     type: ALLOWED_STORAGE_TYPES.includes(storageType) ? storageType : ALLOWED_STORAGE_TYPES[0]
    // },
};
