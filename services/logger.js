const winston = require('winston');
const fs = require('fs');

if(!fs.existsSync('logs')){
    fs.mkdirSync('logs');
}

module.exports = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: 'logs/payfast.log',
            maxSize: 10000,
            maxFiles: 10
        })
    ]
});