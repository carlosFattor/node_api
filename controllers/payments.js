const logger = require('../services/logger.js');

const PAY_CREATED = "CREATED";
const PAY_CONFIRMED = "CONFIRMED";
const PAY_CANCELED = "CANCELED";
module.exports = function(app){

    app.get('/payments', function(req, resp){
        console.log("reveived request in 300 port");
        resp.send('ok');
    });

    app.get('/payments/pay/:id', function(req, resp){
        const id = req.params.id;

        const memcachedClient = app.services.MemcachedClient();

        memcachedClient.get('pay-'+id, function(error, value){
            if(error || !value){
                console.log('MISS - key not found '+ JSON.stringify(error));
                logger.info('MISS - key not found '+ JSON.stringify(error));

                const connection = app.persistence.connectionFactory();
                const paymentDao = new app.persistence.PaymentDao(connection);

                paymentDao.findById(id, function(error, response){
                    if(error){
                        peso.status(500).send(error);
                        return;
                    }

                    resp.json(response);
                    return;
                });

            } else {
                console.log('HIT - value' + JSON.stringify(value));
                logger.info('HIT - value' + JSON.stringify(value));
                resp.json(value);
                return;
            }
        });

        
    });

    app.delete('/payments/pay/:id', function(req, resp){
        
        const pay = {};
        const id = req.params.id;
        
        pay.id = id;
        pay.status = PAY_CANCELED;

        const connection = app.persistence.connectionFactory();
        const paymentDao = new app.persistence.PaymentDao(connection);

        paymentDao.update(pay, function(error, result){
            if(error){
                resp.status(500).send('Error trying update payment');
            }
            resp.status(204).send(pay);
        });

    });

    app.put('/payments/pay/:id', function(req, resp){
        const pay = {};
        const id = req.params.id;
        
        pay.id = id;
        pay.status = PAY_CONFIRMED;

        const connection = app.persistence.connectionFactory();
        const paymentDao = new app.persistence.PaymentDao(connection);

        paymentDao.update(pay, function(error, result){
            if(error){
                resp.status(500).send('Error trying update payment');
            }
            resp.status(200).send(pay);
        });
    });

    app.post('/payments/pay', function(req, resp){

        req.assert('payment.form_payment', 'form payment is required').notEmpty();
        req.assert('payment.value', 'value is required').notEmpty().isFloat();

        const errors = req.validationErrors();
        if(errors){
            console.log(errors);
            resp.status(400).send(errors);
            return;
        }
        const pay = req.body['payment'];
        pay.createdAt = new Date;
        pay.status = PAY_CREATED;

        const connection = app.persistence.connectionFactory();
        const paymentDao = new app.persistence.PaymentDao(connection);

        paymentDao.save(pay, function(error, result){
            if(error){
                resp.status(500).send('Error trying insert in DB ' + error);
                return;
            }

            if(pay.form_payment == 'card'){
                const card = req.body['card'];
                const clientCard = new app.services.CardsClient();
                clientCard.authorization(card, function(exception, request, response, _return){
                    if(exception){
                        console.log(exception);
                        resp.status(400).send(exception);
                        return;
                    }

                    setOnClient(id, _return);
                    resp.status(201).send(_return);
                    return;
                });
            } else {

                pay.id = result.insertId;
                resp.location('/payments/pay/' + pay.id);
                
                const response = {
                    payment_info : pay,
                    links: [
                        {
                            href: 'http://localhost:3000/payments/payment/'+pay.id,
                            rel: 'confirm',
                            method: 'PUT'
                        },{
                            href: 'http://localhost:3000/payments/payment/'+pay.id,
                            rel: 'cancel',
                            method: 'DELETE'
                        }]
                }
                console.log("setOnClient(pay.id, response)<======")
                setOnClient(pay.id, response);
                resp.status(201).send(response);
                return;
            }
            
        });
    });

    function setOnClient(id, values){
        console.log("na funcao<====")
        const cache = app.services.MemcachedClient(); 
        cache.set('pay-'+id, values, 60000, function(error){
            if(error){
                console.log(error);
            } else {
                console.log('set new value on cache');
            }
        });
    }

};