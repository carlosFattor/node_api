var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var express_validator = require('express-validator');
var morgan = require('morgan');
var logger = require('../services/logger.js');
var cors = require('cors')

module.exports = function(){
    var app = express();

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