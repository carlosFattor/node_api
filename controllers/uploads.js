var fs = require('fs');

module.exports = function(app){

    app.post('/upload/images', function(req, resp){
        var filename = req.headers.filename;
        console.log("Nome da imagem ===> "+ filename);
        req.pipe(fs.createWriteStream('files/'+ filename + new Date().getMilliseconds().toString()))
            .on('finish', function(){
                console.log("imagem criada com sucesso!!!")
                resp.status(201).send('OK');
            });
    });
}