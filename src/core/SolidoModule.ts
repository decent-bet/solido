
import { ContractImport } from '../types';
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
    entity: any;
    provider?: any;
    enableDynamicStubs?: boolean;
}

export interface BindModuleContracts {
    [key: string]: SolidoContract & SolidoProvider;
}

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
}

export class SolidoModule {
    providers: SolidoProvider[];
    constructor(private contractMappings: ContractProviderMapping[], ...providers: any[]) {
        this.providers = providers;
    }

    bindContracts(): ContractCollection {
        const coll = new ContractCollection();
        this.contractMappings.map((c, index) => {
            // Creates temp fn to clone prototype
            const init: any = function fn() {}
            init.prototype = Object.create(c.entity.prototype);
      
            let provider = c.provider;
            if (this.providers && this.providers.length > 0) {
                provider = this.providers[index];
            }
            // Apply provider and SolidoProvider Plugin to entity type
            applyMixins(init, [provider, SolidoProvider]);
            const instance = new init();
            instance.setContractImport(c.import);
            if (c.enableDynamicStubs) {
                instance.buildDynamicStubs();
            }
            coll.add(c.name, instance as SolidoContract & SolidoProvider);
        });
        return coll;
    }
}
