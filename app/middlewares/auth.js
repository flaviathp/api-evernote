require('dotenv').config();
const secret = process.env.JWT_TOKEN;

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const WithAuth = (req, res, next) => {
    const token = req.headers['x-access-token'];
    
    // verificação do token
    if (!token) {
        res.status(401).json({ error: 'Unauthorized: no token provided' });
    } else {
        jwt.verify(token, secret, (err, decoded) => {
            // se estiver errado retorna erro, se estiver correto altera a requisição inserindo o usuário e e-mail
            if (err) {
                res.status(401).json({ error: 'Unauthorized: invalid token' });
            } else {
                // sobrescreve o objeto da requisição colocando nele o e-mail do usuário
                // decoded é o token decodado
                req.email = decoded.email;
                // encontrar o usuário
                User.findOne({ email: decoded.email })
                // insere o usuário na requisição
                .then (user => {
                    req.user = user;
                    next();
                })
                .catch(err => {
                    res.status(401).json({ error:err });
                })
            }
        })
    }
};

module.exports = WithAuth;