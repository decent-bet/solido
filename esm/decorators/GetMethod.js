export function GetMethod(options) {
    return (target, propertyKey) => {
        const getMethod = function () {
            const self = this;
            return self.getMethod(options.name || propertyKey);
        };
        Object.defineProperty(target, propertyKey, {
            value: getMethod,
            enumerable: false,
            configurable: true
        });
    };
}
