function PaymentDao(connection) {
    this._connection = connection;
}

PaymentDao.prototype.save = function (pagamento, callback) {
    this._connection.query('INSERT INTO pagamentos SET ?', pagamento, callback);
}

PaymentDao.prototype.update = function (pagamento, callback) {
    this._connection.query('UPDATE pagamentos SET status = ? WHERE id = ?', [pagamento.status, pagamento.id], callback);
}

PaymentDao.prototype.findById = function (id, callback) {
    this._connection.query("SELECT * FROM pagamentos WHERE id = ?", [id], callback);
}

PaymentDao.prototype.list = function (callback) {
    this._connection.query('SELECT * FROM pagamentos', callback);
}

PaymentDao.prototype.delete = function(id, callback){
    this._connection.query("DELETE FROM pagamentos WHERE id = ?", id, callback);
}

module.exports = function () {
    return PaymentDao;
};