const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../JWT/JWT_SECRET.js');

function auth(req, res, next) {
    const authToken = req.headers['authorization'];
    
    if (authToken) {
        const token = authToken.split(' ')[1];
        
        jwt.verify(token, JWT_SECRET, (err, data) => {
            if (err) {
                res.status(401);
                res.json({err: "Token inválido"});
            } else {
                req.token = token;
                req.loggedUser = {id: data.id, email: data.email};
                next();
            }
        })
    } else {
        res.status(401);
        res.json({err: "Token inválido"});
    }
}

module.exports = auth;