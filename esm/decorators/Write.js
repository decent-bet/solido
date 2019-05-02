var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { validate } from './Utils';
export function _Write(name, contract, args, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (options.validations) {
            validate(options.validations, args);
        }
        const func = contract.getMethod(options.name || name);
        const signer = yield contract.prepareSigning(func, options, args);
        return signer.requestSigning();
    });
}
export function Write(options = {}) {
    return (target, propertyKey) => {
        const write = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                return _Write(propertyKey, this, args, options);
            });
        };
        Object.defineProperty(target, propertyKey, {
            value: write,
            enumerable: false,
            configurable: true
        });
    };
}
