
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

export interface ProviderInstance {
    provider: any;
    options: any;
}

export interface ProviderInstances {
    [key: string]: ProviderInstance;
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

export interface ConnectedContracts {
    [key: string]: (SolidoContract & SolidoProvider);
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

    /**
     * Connects contracts previously configured in bindContracts
     */
    connect(): ConnectedContracts {
        const contracts = {};
        Object.keys(this.coll).forEach(i => {
            const c = (this.coll[i] as  SolidoContract);
            c.connect();
            contracts[i] = c;
        })
        return contracts;
    }
}

class Empty {}
export class SolidoModule {
    providers: SolidoProvider[];
    constructor(private contractMappings: ContractProviderMapping[], ...providers: any[]) {
        this.providers = providers;
    }

    bindContracts(setupOptions?: ProviderInstances): ContractCollection {
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
                this.bindContract(provider, c, coll, true, setupOptions);
            })            
        } else {
            this.contractMappings.map((c) => {      
                let provider = c.provider;
                this.bindContract(provider, c, coll, false, setupOptions);
            });
        }

        return coll;
    }


    /**
     * Binds and configures a contract
     * @param provider Plugin provider type
     * @param c Contract mapping
     * @param collection Contract collection
     * @param generateName If true, generates a name
     * @param setupOptions Provider instance config
     */
    private bindContract(provider: any, c: ContractProviderMapping, collection: ContractCollection, generateName: boolean, setupOptions?: ProviderInstances) {
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
        const providerKeyName = instance.getProviderType();
        const providerName = SolidoProviderType[providerKeyName];
        if (generateName) {
            name = `${providerName}${c.name}`;            
        }
        const contract = instance as SolidoContract & SolidoProvider;
        collection.add(name, contract);

        if (setupOptions) {
            // find provider instance options
            const instanceOptions = setupOptions[providerKeyName];
            if (instanceOptions) {
                contract.setInstanceOptions(instanceOptions);
            }
        }
    }
}
