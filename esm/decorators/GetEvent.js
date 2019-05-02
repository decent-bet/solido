export function GetEvent(options) {
    return (target, propertyKey) => {
        const getEvent = function () {
            const self = this;
            return self.getEvent(options.name || propertyKey);
        };
        Object.defineProperty(target, propertyKey, {
            value: getEvent,
            enumerable: false,
            configurable: true
        });
    };
}
