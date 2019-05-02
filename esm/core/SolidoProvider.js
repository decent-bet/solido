import { TopicSignature } from './TopicSignature';
import { _Read, _Write } from '../decorators';
export class SolidoProvider {
    buildDynamicStubs() {
        if (this.abi.length > 0) {
            const contract = this;
            this.methods = {};
            this.abi.forEach(definition => {
                if (definition.type === 'function' && definition.stateMutability === 'view') {
                    this.methods = Object.assign({}, this.methods, { [definition.name]: (...req) => _Read(definition.name, contract, req, {}) });
                }
                if (definition.type === 'function' && definition.stateMutability === 'nonpayable') {
                    this.methods = Object.assign({}, this.methods, { [definition.name]: (...req) => _Write(definition.name, contract, req, {}) });
                }
            });
        }
    }
    setContractImport(contractImport) {
        this.abi = contractImport.raw.abi;
        this.contractImport = contractImport;
        this.abi.forEach(definition => {
            if (definition.type === 'event' && definition.signature) {
                const topic = new TopicSignature(definition.signature);
                this.topics = Object.assign({}, this.topics, { [definition.name]: topic });
            }
        });
    }
}
