const jwt = require('jsonwebtoken');



async function generateJWT(payload, key, expiresIn) {
    const token = jwt.sign(payload,key, {expiresIn})
    return token;
}


async function verifyJWT(token, key){
    return jwt.verify(token,key)
}

module.exports = {
    generateJWT,
    verifyJWT
}