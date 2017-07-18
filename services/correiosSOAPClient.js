const soap = require('soap');

function correiosSOAPClient(){
    this._wsdl = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
}

correiosSOAPClient.prototype.calcPrazo = function(args, callback){

    soap.createClient(this._wsdl, function(error, client){
        if(error){
            console.log(error);
            return;
        }
        client.CalcPrazo(args, callback);
    });
}

module.exports = function(){
    return correiosSOAPClient;
}