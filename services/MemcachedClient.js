const memcached = require('memcached');

function createdMemcachedClient(){
    const _client = new memcached('localhost:11211', {
        retries: 10,
        retry: 1000,
        remove: true
    });
    return _client;
}
module.exports = function(){
    return createdMemcachedClient;
}