const cluster = require('cluster');
const os = require('os');

console.log('executando thread');
const cpus = os.cpus();
//console.log(cpus);
if(cluster.isMaster){
    console.log('thread master');
    cpus.forEach(function(){
        cluster.fork();
    });

    cluster.on('listening', function(worker){
        console.log('cluster conectado==> ' + worker.process.pid);
    });

    cluster.on('exit', worker => {
        console.log('cluster %d desconectado', worker.process.pid);
        cluster.fork();
    });
} else {
    console.log('thread slave');
    require('./index.js');
}