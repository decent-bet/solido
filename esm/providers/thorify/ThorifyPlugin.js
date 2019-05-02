var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SolidoProviderType } from '../../types';
import { ThorifySigner } from './ThorifySigner';
import { SolidoProvider } from '../../core/SolidoProvider';
export class ThorifyPlugin extends SolidoProvider {
    get from() {
        return this.defaultAccount;
    }
    getProviderType() {
        return SolidoProviderType.Thorify;
    }
    onReady(settings) {
        const { privateKey, thor, chainTag, from } = settings;
        this.privateKey = privateKey;
        this.thor = thor;
        this.chainTag = chainTag;
        this.defaultAccount = from;
        this.instance = new thor.eth.Contract(this.contractImport.raw.abi, this.contractImport.address[chainTag]);
        this.address = this.contractImport.address[chainTag];
        if (privateKey) {
            this.thor.eth.accounts.wallet.add(privateKey);
        }
    }
    prepareSigning(methodCall, options, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let gas = options.gas;
            let gasPriceCoef = options.gasPriceCoef;
            if (!options.gasPriceCoef)
                gasPriceCoef = 0;
            if (!options.gas)
                gas = 1000000;
            const fn = methodCall(...args);
            return new ThorifySigner(this.thor, fn, this.defaultAccount, {
                gas,
                gasPriceCoef
            });
        });
    }
    getAbiMethod(name) {
        return this.abi.filter(i => i.name === name)[0];
    }
    callMethod(name, args) {
        let addr;
        addr = this.contractImport.address[this.chainTag];
        return this.instance.methods[name](...args).call({
            from: addr
        });
    }
    getMethod(name) {
        return this.instance.methods[name];
    }
    getEvent(name) {
        return this.instance.events[name];
    }
    getEvents(name, eventFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {};
            if (eventFilter) {
                const { range, filter, topics, order, pageOptions, blocks } = eventFilter;
                if (filter) {
                    options.filter = filter;
                }
                if (blocks) {
                    const { fromBlock, toBlock } = blocks;
                    options.toBlock = toBlock;
                    options.fromBlock = fromBlock;
                }
                if (range) {
                    options.range = range;
                }
                if (topics) {
                    options.topics = topics.get();
                }
                options.order = order || 'desc';
                if (pageOptions) {
                    options.options = pageOptions;
                }
            }
            return yield this.instance.getPastEvents(name, options);
        });
    }
}
