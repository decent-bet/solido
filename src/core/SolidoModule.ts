
import { ContractImport, SolidoProviderType } from '../types';
import { SolidoContract } from './SolidoContract';
import { SolidoProvider } from '..';

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

export interface ContractProviderMapping {
    name: string;
    import: ContractImport;
    entity?: any;
    provider?: any;
    enableDynamicStubs?: boolean;
}

export interface BindModuleContracts {
    [key: string]: SolidoContract & SolidoProvider;
}

/**
 * Contract collection stores the contracts
 */
export class ContractCollection {
    private coll: BindModuleContracts = {};
    add(key: string, c: SolidoContract & SolidoProvider) {
        this.coll[key] = c;
    }
    getContract<T>(key: string): T & SolidoContract & SolidoProvider {
        return (this.coll[key] as any) as T &
        SolidoContract &
        SolidoProvider;
    }
    getDynamicContract(key: string): SolidoContract & SolidoProvider {
        return this.coll[key];
    }
}

class Empty {}
export class SolidoModule {
    providers: SolidoProvider[];
    constructor(private contractMappings: ContractProviderMapping[], ...providers: any[]) {
        this.providers = providers;
    }

    bindContracts(): ContractCollection {
        const coll = new ContractCollection();

        // if one contract mapping exists
        // and multiple providers
        // use short module syntax
        if (this.contractMappings.length === 1 && this.providers.length > 0) {
            const c = this.contractMappings[0];
            this.providers.forEach( (provider) => {
                const name = c.name;
                if (!name) {
                    throw new Error('Must have a name for short module syntax');
                }
                this.bindContract(provider, c, coll, true);
            })
            return coll;
        }


        this.contractMappings.map((c) => {      
            let provider = c.provider;
            this.bindContract(provider, c, coll);
        });
        return coll;
    }


    private bindContract(provider: any, c: ContractProviderMapping, collection: ContractCollection, generateName?: boolean) {
        if (!provider) {
            throw new Error(`Missing provider for ${c.name}`);
        }
        if (!c && c.import) {
            throw new Error(`Missing import for ${c.name}`);
        }
        // if no entity is added and dynamic, use an empty class
        if (!c.entity && c.enableDynamicStubs) {
            c.entity = Empty;
        }

        if (!c.entity && !c.enableDynamicStubs) {
            throw new Error('Must provide an entity class');
        }

        // Creates temp fn to clone prototype
        const init: any = function fn() {}
        init.prototype = Object.create(c.entity.prototype);
        
        // Apply provider and SolidoProvider Plugin to entity type
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
        collection.add(name, instance as SolidoContract & SolidoProvider);
    }
}
