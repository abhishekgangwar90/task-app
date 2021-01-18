const jwtUtil = require('../utils/jwt')
const Users = require('../models/users')
const errorCodes = require('../constants/errorCodes');
const chalk = require('chalk');

async function auth(req,res,next){
    
    try {
        if(req.headers && req.headers.authorization){
            const token = req.headers['authorization'].replace('Bearer ','');

            const decoded = await jwtUtil.verifyJWT(token, 'MyPrivateKey')

            // if invalid then send unauthorized error
            if(!decoded){
                console.log(chalk.red('Auth - User Not Authorized.'));
                return res.status(401).send(errorCodes.unauthorizedError)
            }
            // else find the user and send concat it to request.
            const user = await Users.findOne({_id: decoded._id, 'tokens.authToken': token});

            if(!user){
                console.log(chalk.red('Auth- User Not found.'));
                return res.status(401).send(errorCodes.unauthorizedError)
            }

            req.user = user;
            req.token = token;
        }
        next()
    } catch (error) {
        console.log(chalk.red.inverse('Auth - UnExpected error occured'));
        res.status(500).send();
    }
}

module.exports = auth;