module.exports = function(app){
    app.get('/users', function(req, resp){
        console.log("users controllers...");

        resp.status(200).send('OK users');
    });
}