import {encode} from 'base-64';
import random from 'lodash.random';

export const generateToken = () => {
    return encode((new Date()).toISOString() + random(0, 9999))
}

export default {
    generateToken
}