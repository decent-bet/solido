import { ContractImport, SolidoProviderType } from '../types';
import { TopicSignature } from './TopicSignature';
import { _Read, _Write } from '../decorators';


/**
 * A provider is a plugin to use contract entities with a blockchain. The main task of a provider is to load up the Solidity ABI definition
 * and enable any auto generated helpers or methods.
 */
export abstract class SolidoProvider {
    public topics: { [key: string]: TopicSignature };
    public methods: { [key: string]: any };
    protected abi: any[];
    protected contractImport: ContractImport;
    protected providerType: SolidoProviderType;

    public abstract getProviderType(): SolidoProviderType;

    protected buildDynamicStubs(): void {
        if (this.abi.length > 0) {
            const contract: any = this;
            this.methods = {};
            // Add Read, Writes
            this.abi.forEach(definition => {
                if (definition.type === 'function' && definition.stateMutability === 'view') {
                    this.methods = {
                        ...this.methods,
                        [definition.name]: (...req: any[]) => _Read(definition.name, contract, req, {})
                    };
                }
                if (definition.type === 'function' && definition.stateMutability === 'nonpayable') {
                    this.methods = {
                        ...this.methods,
                        [definition.name]: (...req: any[]) => _Write(definition.name, contract, req, {})
                    };
                }
            });
        }
    }

    protected setContractImport(contractImport: ContractImport): void {
        this.abi = contractImport.raw.abi as any;
        this.contractImport = contractImport;

        // Add topics
        this.abi.forEach(definition => {
            if (definition.type === 'event' && definition.signature) {
                const topic = new TopicSignature(definition.signature);
                this.topics = {
                    ...this.topics,
                    [definition.name]: topic
                };
            }
        });
    }
}
