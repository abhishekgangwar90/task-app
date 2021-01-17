const jwtUtil = require('../utils/jwt')
const Users = require('../models/users')
const errorCodes = require('../constants/errorCodes')

function auth(req,res,next){
    
    if(req.headers){
        const token = req.headers('Authorization').replace('Bearer ','');

        const decoded = jwtUtil.verifyJWT(token, 'MyPrivateKey')

        // if invalid then send unauthorized error
        if(!decoded){
           return res.status(401).send(errorCodes.unauthorizedError)
        }
        // else find the user and send concat it to request.
        const user = Users.findOne({_id: decoded._id, 'tokens.token': token})
    }

    next()

}

module.exports = auth;