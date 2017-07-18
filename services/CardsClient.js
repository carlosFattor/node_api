const restfy = require('restify');

function CardsClient(){
    this._client = restfy.createJSONClient({
        url: 'http://localhost:3001',
        version: '~1.0'
    });
}

CardsClient.prototype.authorization = function(card, callback){
    this._client.post('/cartoes/autoriza', card, callback);
}

module.exports = function(){
    return CardsClient;
}