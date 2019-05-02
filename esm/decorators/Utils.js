import { BigNumber } from 'bignumber.js';
const ethereumRegex = require('ethereum-regex');
export function validate(params, values) {
    const keys = Object.keys(params);
    for (let i = 0; i < values.length; i++) {
        const val = values[i];
        const validationType = params[keys[i]];
        if (validationType === 'address') {
            if (!ethereumRegex({ exact: true }).test(val)) {
                throw new Error(`Invalid adress type: parameter ${keys[i]}`);
            }
        }
        else if (validationType === 'bignumber') {
            if (!BigNumber.isBigNumber(val)) {
                throw new Error(`Invalid bignumber type: parameter ${keys[i]}`);
            }
        }
        else {
            throw new Error(`Invalid string type: parameter ${keys[i]}`);
        }
    }
    return true;
}
