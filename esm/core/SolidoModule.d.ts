import { ContractImport } from '../types';
import { SolidoContract } from './SolidoContract';
import { SolidoProvider } from '..';
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
export declare class ContractCollection {
    private coll;
    add(key: string, c: SolidoContract & SolidoProvider): void;
    getContract<T>(key: string): T & SolidoContract & SolidoProvider;
    getDynamicContract(key: string): SolidoContract & SolidoProvider;
}
export declare class SolidoModule {
    private contractMappings;
    providers: SolidoProvider[];
    constructor(contractMappings: ContractProviderMapping[], ...providers: any[]);
    bindContracts(): ContractCollection;
    private bindContract;
}
