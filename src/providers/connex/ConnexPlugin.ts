// eslint-disable-next-line spaced-comment
/// <reference types="@vechain/connex" />

import { abi } from 'thor-devkit';
import { IMethodOrEventCall, EventFilter, SolidoProviderType } from '../../types';
import { ConnexSigner } from './ConnexSigner';
import { ConnexSettings } from './ConnexSettings';
import { SolidoContract, SolidoSigner } from '../../core/SolidoContract';
import { SolidoProvider } from '../../core/SolidoProvider';
import { SolidoTopic } from '../../core/SolidoTopic';

/**
 * ConnexPlugin provider for Solido
 */

export class ConnexPlugin extends SolidoProvider
    implements SolidoContract {
    public connex: Connex;
    public chainTag: string;
    public defaultAccount: string;
    public address: string;
    
    public getProviderType(): SolidoProviderType {
        return SolidoProviderType.Connex
    }

    public onReady<T>(settings: T & ConnexSettings): void {
        const { connex, chainTag, defaultAccount } = settings;
        this.connex = connex;
        this.chainTag = chainTag;
        this.defaultAccount = defaultAccount;
        this.address = this.contractImport.address[this.chainTag];
    }

    public prepareSigning(methodCall: any, options: IMethodOrEventCall, args: any[]):  Promise<SolidoSigner> {
        if (!options.gas) {
            throw new Error('Missing IMethodOrEventCall.gas');
        }
        const connex = this.connex;
        const signingService = connex.vendor.sign('tx');
        signingService.signer(this.defaultAccount);
        signingService.gas(options.gas || 300_000); // Set maximum gas

        const payload = methodCall.asClause(...args);

        const signer = new ConnexSigner(signingService, payload);
        return Promise.resolve(signer);
    }

    public getAbiMethod(name: string, address?: string): object {
        let addr;
        if (!address) {
            addr = this.contractImport.address[this.chainTag];
        }
        return this.abi.filter(i => i.name === name)[0];
    }

    /**
   * Gets a Connex Method object
   * @param address contract address
   * @param methodAbi method ABI
   */
    public getMethod(name: string, address?: string): any {
        let addr;
        addr = this.contractImport.address[this.chainTag];
        const acc = this.connex.thor.account(addr);
        let methodAbi: any = name;
        if (typeof name === 'string') {
            methodAbi = this.abi.filter(
                i => i.name === name
            )[0] as abi.Function.Definition;
        }
        return acc.method(methodAbi as object);
    }

    public callMethod(name: string, args: any[]): any {
        let addr = this.contractImport.address[this.chainTag];
        const acc = this.connex.thor.account(addr);
        let methodAbi: any = name;
        if (typeof name === 'string') {
            methodAbi = this.abi.filter(
                i => i.name === name
            )[0] as abi.Function.Definition;
        }
        return acc.method(methodAbi as object).call(...args);
    }
    /**
   * Gets a Connex Event object
   * @param address contract address
   * @param eventAbi event ABI
   */
    public getEvent(
        name: string,
    ): any {
        let addr = this.contractImport.address[this.chainTag];
        const acc = this.connex.thor.account(addr);

        let eventAbi: any;
        if (typeof name === 'string') {
            eventAbi = this.abi.filter(
                i => i.name === name
            )[0] as abi.Event.Definition;
        }
        return acc.event(eventAbi as any);
    }

    public async getEvents<P, T>(name: string, eventFilter?: EventFilter<T & object[]>): Promise<(P & Connex.Thor.Event)[]> {
      
        const event: Connex.Thor.EventVisitor = this.getEvent(name);

        // default page options
        let offset = 0;
        let limit = 25;

        if(eventFilter) {
            const { range, filter, order, pageOptions, topics } = eventFilter;
            let connexFilter: Connex.Thor.Filter<"event"> = event.filter(filter || []);

            if (topics) {
                let criteria = (topics as SolidoTopic).get();
                connexFilter = connexFilter.criteria(criteria);
            }

            if(range) {
                const { unit, to, from } = range;
                connexFilter = connexFilter.range({
                    unit,
                    from,
                    to
                })
            }
      
            connexFilter = connexFilter.order(order || 'desc');

            if (pageOptions) {
                offset = pageOptions.offset;
                limit = pageOptions.limit;
            }
            return await connexFilter.apply(offset, limit) as (P & Connex.Thor.Event)[];
        }

        return await event.filter([])
            .apply(offset, limit) as (P & Connex.Thor.Event)[];
    }
}
