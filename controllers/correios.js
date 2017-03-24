module.exports = function(app){
    app.post('/correios/calculo-prazo', function(req, resp){
        var dadosEntrega = req.body;
        console.log("teste");
        var correiosService = new app.services.correiosSOAPClient();
        console.log("teste");
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