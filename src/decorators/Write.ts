import { validate } from './Utils';
import { IMethodOrEventCall, IMethodConfig } from '../types';
import { SolidoContract } from '../core/SolidoContract';

export async function _Write(name: string, contract: SolidoContract, args: any[], options: IMethodOrEventCall = {}) {
    return {
        call: async (config: IMethodConfig = {}) => {

            const cfg = Object.assign({}, options, config);
            // Validate
            if (cfg.validations) {
                validate(cfg.validations, args);
            }

            // Get Method
            const func = contract.getMethod(cfg.name || name);

            const signer = await contract.prepareSigning(func, cfg, args);

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

        const write = async function (...args: any[]) {
            return {
                call: (config: IMethodConfig = {}) => _Write(propertyKey, this, args, Object.assign({}, options, config))
            }
        };

        Object.defineProperty(target, propertyKey, {
            value: write,
            enumerable: false,
            configurable: true
        });
    };
}
