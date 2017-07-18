const correios = function(app) {
    app.post('/correios/calculo-prazo', function(req, resp){
        const dadosEntrega = req.body;
        const correiosService = new app.services.correiosSOAPClient();
        correiosService.calcPrazo(dadosEntrega, function(error, result){
            if(error){
                resp.status(500).end(error);
                return;
            }

            console.log(result);
            resp.send(result)
        })
    })
}

module.exports = correios