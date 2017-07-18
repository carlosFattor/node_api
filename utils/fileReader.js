const fs = require('fs');

fs.readFile('gits_d8m8.jpg', function(error, buffer){
    console.log('arquivo lido');
    fs.writeFile('image2.jpg', buffer, function(error){
        console.log('arquivo criado');
    })
});