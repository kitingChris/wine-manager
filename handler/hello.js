helloHandler = function (req, res, next) {
    res.send({
        message: 'Hello '+req.params.name
    });
    return next();
};

module.exports = helloHandler;