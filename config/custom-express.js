const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const express_validator = require('express-validator');
const morgan = require('morgan');
const logger = require('../services/logger.js');
const cors = require('cors')

module.exports = function(){
    const app = express();

    //log com morgan
    app.use(morgan('common', {
        stream: {
            write: function(message){
                logger.info('request=> '+ message);
            }
        }
    }));

    app.use(cors());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(express_validator());

    consign()
        .include('controllers')
        .then('persistence')
        .then('services')
        .into(app);
        
    return app;
}