var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SolidoProviderType } from '../../types';
import { ConnexSigner } from './ConnexSigner';
import { SolidoProvider } from '../../core/SolidoProvider';
export class ConnexPlugin extends SolidoProvider {
    getProviderType() {
        return SolidoProviderType.Connex;
    }
    onReady(settings) {
        const { connex, chainTag, defaultAccount } = settings;
        this.connex = connex;
        this.chainTag = chainTag;
        this.defaultAccount = defaultAccount;
        this.address = this.contractImport.address[this.chainTag];
    }
    prepareSigning(methodCall, options, args) {
        if (!options.gas) {
            throw new Error('Missing IMethodOrEventCall.gas');
        }
        const connex = this.connex;
        const signingService = connex.vendor.sign('tx');
        signingService.signer(this.defaultAccount);
        signingService.gas(options.gas || 300000);
        const payload = methodCall.asClause(...args);
        const signer = new ConnexSigner(signingService, payload);
        return Promise.resolve(signer);
    }
    getAbiMethod(name, address) {
        let addr;
        if (!address) {
            addr = this.contractImport.address[this.chainTag];
        }
        return this.abi.filter(i => i.name === name)[0];
    }
    getMethod(name, address) {
        let addr;
        addr = this.contractImport.address[this.chainTag];
        const acc = this.connex.thor.account(addr);
        let methodAbi = name;
        if (typeof name === 'string') {
            methodAbi = this.abi.filter(i => i.name === name)[0];
        }
        return acc.method(methodAbi);
    }
    callMethod(name, args) {
        let addr = this.contractImport.address[this.chainTag];
        const acc = this.connex.thor.account(addr);
        let methodAbi = name;
        if (typeof name === 'string') {
            methodAbi = this.abi.filter(i => i.name === name)[0];
        }
        return acc.method(methodAbi).call(...args);
    }
    getEvent(name) {
        let addr = this.contractImport.address[this.chainTag];
        const acc = this.connex.thor.account(addr);
        let eventAbi;
        if (typeof name === 'string') {
            eventAbi = this.abi.filter(i => i.name === name)[0];
        }
        return acc.event(eventAbi);
    }
    getEvents(name, eventFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = this.getEvent(name);
            let offset = 0;
            let limit = 25;
            if (eventFilter) {
                const { range, filter, order, pageOptions, topics } = eventFilter;
                let connexFilter = event.filter(filter || []);
                if (topics) {
                    let criteria = topics.get();
                    connexFilter = connexFilter.criteria(criteria);
                }
                if (range) {
                    const { unit, to, from } = range;
                    connexFilter = connexFilter.range({
                        unit,
                        from,
                        to
                    });
                }
                connexFilter = connexFilter.order(order || 'desc');
                if (pageOptions) {
                    offset = pageOptions.offset;
                    limit = pageOptions.limit;
                }
                return yield connexFilter.apply(offset, limit);
            }
            return yield event.filter([])
                .apply(offset, limit);
        });
    }
}
