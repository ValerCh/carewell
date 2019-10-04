const {hashSync, compareSync} = require('bcryptjs');
const jwt = require("jsonwebtoken");

const {secretOrKey} = require('../config/keys');

module.exports = {
    hashPassword(password) {
        return hashSync(password);
    },
    authenticateUser(hash, plain) {
        return compareSync(plain, hash);
    },
    async generateToken(payload, expiresIn) { 
        return new Promise(function(resolve, reject) {
            jwt.sign(
                payload,
                secretOrKey,
                {
                    expiresIn: expiresIn // 1 year in seconds
                },
                (err, token) => {
                    resolve({ err, token });
                }
            );
        });
    },

    checkToken(req, res, next, roles) {
        let token = req.headers['token'] || req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        if (!token) {
            return res.json({
                success: false,
                message: 'Token does not exist'
            });
        }

        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        if (token) {
            jwt.verify(token, secretOrKey, (err, decoded) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Token is not valid'
                    });
                } else {
                    if (roles.indexOf(decoded.role) == -1) {
                        return res.json({
                            success: false,
                            message: 'Access denied'
                        });
                    } else {
                        req.decoded = decoded;
                        next();
                    }
                }
            });
        } else {
            return res.json({
                success: false,
                message: 'Auth token is not supplied'
            });
        }
    },

    currentUser(req, res) {
        let token = req.headers['token'] || req.headers['x-access-token'] || req.headers['authorization'];
        if (!token) return res.status(401).send({success: false, message: 'Access denied. No token provided.'});
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        try {
            return jwt.verify(token, secretOrKey, (err, decodedToken) => {
                return decodedToken;
            });
        } catch (e) {
            res.status(400).send({success: false, message: 'Invalid token.'});
        }
    }
};