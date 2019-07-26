import { validate } from './Utils';
import { IMethodOrEventCall, IMethodConfig } from '../types';
import { SolidoContract } from '../core/SolidoContract';

export function _Write(name: string, contract: SolidoContract, args: any[], options: IMethodOrEventCall = {}) {
    return {
        // to avoid conflicts with pure javascript clients
        request: async (config: IMethodConfig) => {
            if (!config) throw new Error('Missing tx config');
            // Validate
            if (options.validations) {
                validate(options.validations, args);
            }

            // Get Method
            const func = contract.getMethod(options.name || name);

            const signer = await contract.prepareSigning(func, Object.assign({}, options, config), args);

            return signer.requestSigning();
        },        
        // overrides javascript call
        call: async (config: IMethodConfig = {}) => {
            // Validate
            if (options.validations) {
                validate(options.validations, args);
            }

            // Get Method
            const func = contract.getMethod(options.name || name);

            const signer = await contract.prepareSigning(func, Object.assign({}, options, config), args);

            return signer.requestSigning();
        }
    }
}
/**
 * Annotates a Solido signing call
 * @param options An IMethodOrEventCall props
 */
export function Write(options: IMethodOrEventCall = {}) {
    return (target: any, propertyKey: string) => {

        const write = function (...args: any[]) {
            return _Write(propertyKey, this, args, options);
        };

        Object.defineProperty(target, propertyKey, {
            value: write,
            enumerable: false,
            configurable: true
        });
    };
}
