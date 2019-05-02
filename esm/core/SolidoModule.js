import { SolidoProviderType } from '../types';
import { SolidoProvider } from '..';
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
export class ContractCollection {
    constructor() {
        this.coll = {};
    }
    add(key, c) {
        this.coll[key] = c;
    }
    getContract(key) {
        return this.coll[key];
    }
    getDynamicContract(key) {
        return this.coll[key];
    }
}
class Empty {
}
export class SolidoModule {
    constructor(contractMappings, ...providers) {
        this.contractMappings = contractMappings;
        this.providers = providers;
    }
    bindContracts() {
        const coll = new ContractCollection();
        if (this.contractMappings.length === 1 && this.providers.length > 0) {
            const c = this.contractMappings[0];
            this.providers.forEach((provider) => {
                const name = c.name;
                if (!name) {
                    throw new Error('Must have a name for short module syntax');
                }
                this.bindContract(provider, c, coll, true);
            });
            return coll;
        }
        this.contractMappings.map((c) => {
            let provider = c.provider;
            this.bindContract(provider, c, coll);
        });
        return coll;
    }
    bindContract(provider, c, collection, generateName) {
        if (!provider) {
            throw new Error(`Missing provider for ${c.name}`);
        }
        if (!c && c.import) {
            throw new Error(`Missing import for ${c.name}`);
        }
        if (!c.entity && c.enableDynamicStubs) {
            c.entity = Empty;
        }
        if (!c.entity && !c.enableDynamicStubs) {
            throw new Error('Must provide an entity class');
        }
        const init = function fn() { };
        init.prototype = Object.create(c.entity.prototype);
        applyMixins(init, [provider, SolidoProvider]);
        const instance = new init();
        instance.setContractImport(c.import);
        if (c.enableDynamicStubs) {
            instance.buildDynamicStubs();
        }
        let name = c.name;
        if (generateName) {
            const providerName = SolidoProviderType[instance.getProviderType()];
            name = `${providerName}${c.name}`;
        }
        collection.add(name, instance);
    }
}
