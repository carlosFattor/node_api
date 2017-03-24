var fs = require('fs');

fs.createReadStream('gits_d8m8.jpg')
    .pipe(fs.createWriteStream('imagemStream.jpg'))
    .on('finish', function(){
        console.log("stream finalizado...");
    });