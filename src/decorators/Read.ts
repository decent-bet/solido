import { validate } from './Utils';
import { IMethodOrEventCall } from '../types';
import { SolidoContract } from '../core/SolidoContract';

export function _Read(
    name: string,
    contract: SolidoContract,
    args: any[],
    options: IMethodOrEventCall = {}
) {
    // Validate
    if (options.validations) {
        validate(options.validations, args);
    }
    // Get Method
    const call = contract.callMethod(options.name || name, args);

    // Return response
    return call;
}

/**
 * Annotates a Solido call
 * @param options IMethodOrEventCall props
 */
export function Read(options: IMethodOrEventCall = {}) {
    return (target: any, propertyKey: string) => {
        const read = async function(...args: any[]) {
            return _Read(propertyKey, this, args, options);
        };
        
        Object.defineProperty(target, propertyKey, {
            value: read,
            enumerable: false,
            configurable: true
        });
    };
}
