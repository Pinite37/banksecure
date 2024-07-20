const crypo = require('crypto');

const generateSecret = () => {
    return crypo.randomBytes(64).toString('hex');
}

const secret = generateSecret()

console.log('Generated secret: ', secret)