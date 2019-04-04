import { SolidoContract } from '../core/SolidoContract';
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
            enumerable: false
        });
    };
}