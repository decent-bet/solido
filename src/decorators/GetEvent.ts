import { SolidoContract } from '../core/SolidoContract';

export function _GetEvent(name: string, contract: SolidoContract) {
    return contract.getEvent(name);        
}

/**
 * Annotates a Connex thor.event
 * @param options props
 */
export function GetEvent(options?: { name: string }) {
    return (
        target: any,
        propertyKey: string
    ) => {
        const getEvent = function() {
            const self = this as SolidoContract;
            return self.getEvent(
                options.name || propertyKey
            );
        };
        
        Object.defineProperty(target, propertyKey, {
            value: getEvent,
            enumerable: false,
            configurable: true
        });
    };
}