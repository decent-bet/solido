export function GetEvents(options) {
    return (target, propertyKey) => {
        const getEventsCall = function (fnOptions) {
            const self = this;
            const callOptions = Object.assign({}, options, fnOptions, { name: options.name });
            return self.getEvents(options.name || propertyKey, callOptions);
        };
        Object.defineProperty(target, propertyKey, {
            value: getEventsCall,
            enumerable: false,
            configurable: true
        });
    };
}
