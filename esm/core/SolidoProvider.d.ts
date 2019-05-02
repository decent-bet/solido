import { ContractImport, SolidoProviderType } from '../types';
import { TopicSignature } from './TopicSignature';
export declare abstract class SolidoProvider {
    topics: {
        [key: string]: TopicSignature;
    };
    methods: {
        [key: string]: any;
    };
    protected abi: any[];
    protected contractImport: ContractImport;
    protected providerType: SolidoProviderType;
    abstract getProviderType(): SolidoProviderType;
    protected buildDynamicStubs(): void;
    protected setContractImport(contractImport: ContractImport): void;
}
