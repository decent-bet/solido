import { BigNumber } from 'bignumber.js';
import { IValidationType } from '../types';


// extracted from ethereum-regex
const re = '0x[a-fA-F0-9]{40}';
const ethereumRegex = opts => {
    opts = opts || {};
    return opts.exact ? new RegExp('(?:^' + re + '$)') : new RegExp(re, 'g');
};

export function validate(
    params: { [key: string]: IValidationType },
    values: any[]
): boolean {
    // Get keys
    const keys = Object.keys(params);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < values.length; i++) {
        // Obtain value and validation type from params
        const val = values[i];
        const validationType = params[keys[i]];
        if (validationType === 'address') {
            if (!ethereumRegex({ exact: true }).test(val)) {
                throw new Error(`Invalid adress type: parameter ${keys[i]}`);
            }
        } else if (validationType === 'bignumber') {
            if (!BigNumber.isBigNumber(val)) {
                throw new Error(`Invalid bignumber type: parameter ${keys[i]}`);
            }
        } else {
            throw new Error(`Invalid string type: parameter ${keys[i]}`);
        }
    }

    return true;
}

