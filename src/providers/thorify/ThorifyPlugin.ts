// eslint-disable-next-line spaced-comment
import Web3 from 'web3'
import { IMethodOrEventCall, EventFilter, ThorifyLog, SolidoProviderType } from '../../types';
import { ThorifySigner } from './ThorifySigner';
import { ThorifySettings } from './ThorifySettings';
import { SolidoProvider } from '../../core/SolidoProvider';
import { SolidoContract, SolidoSigner } from '../../core/SolidoContract';
import { SolidoTopic } from '../../core/SolidoTopic';
/**
 * ThorifyPlugin provider for Solido
 */
export class ThorifyPlugin extends SolidoProvider implements SolidoContract {
    private thor: Web3;
    public chainTag: string;
    private instance: any;
    public defaultAccount: string;
    public address: string;
    private privateKey: string;
    
    public getProviderType(): SolidoProviderType {
        return SolidoProviderType.Thorify
    }

    onReady<T>(settings: T & ThorifySettings) {
        const { privateKey, thor, chainTag, defaultAccount } = settings;
        this.privateKey = privateKey;
        this.thor = thor;
        this.chainTag = chainTag;
        this.defaultAccount = defaultAccount;
        this.instance = new thor.eth.Contract(
            this.contractImport.raw.abi as any,
            this.contractImport.address[chainTag]
        )
        this.address = this.contractImport.address[chainTag];
        if (privateKey) {
            this.thor.eth.accounts.wallet.add(privateKey);
        }
    }

    async prepareSigning(methodCall: any, options: IMethodOrEventCall, args: any[]):  Promise<SolidoSigner> {
        let gas = options.gas;
        let gasPriceCoef = options.gasPriceCoef;
        
        if (!options.gasPriceCoef) gasPriceCoef = 0
        if (!options.gas) gas = 1000000

        const fn = methodCall(...args);
        // await fn.call({ from: options.from || this.defaultAccount });
        const encodedFunctionCall = fn.encodeABI();
  
        let txBody = {
            from: options.from || this.defaultAccount,
            to: this.address,
            gas,
            encodedFunctionCall,
            gasPriceCoef
        }

        console.log('signAndSendRawTransaction - txBody:', txBody)

        let signed = await this.thor.eth.accounts.signTransaction(
            txBody,
            this.privateKey
        )


        return new ThorifySigner(this.thor, signed);
    }
  
      
    getAbiMethod(name: string): object {
        return this.abi.filter(i => i.name === name)[0];
    }
    
    callMethod(name: string, args: any[]): any {
        let addr;
        addr = this.contractImport.address[this.chainTag];
        return this.instance.methods[name](...args).call({
            from: addr
        })
    }
    /**
     * Gets a Thorify Method object
     * @param name method name
     */
    getMethod(
        name: string,
    ): any {
        return this.instance.methods[name];        
    }

    /**
     * Gets a Connex Event object
     * @param address contract address
     * @param eventAbi event ABI
     */
    getEvent(
        name: string,
    ): any {
        return this.instance.events[name];
    }

    public async getEvents<P, T>(name: string, eventFilter?: EventFilter<T & any>): Promise<(P & ThorifyLog)[]> {
        const options: any = {};
        if(eventFilter) {
            const { range, filter, topics, order, pageOptions, blocks } = eventFilter;
            if(filter) {
                options.filter = filter;
            }

            if(blocks) {
                const { fromBlock, toBlock } = blocks
                options.toBlock = toBlock;
                options.fromBlock = fromBlock;
            }

            if(range) {
                options.range = range
            }

            if(topics) {
                options.topics = (topics as SolidoTopic).get()
            }
      
            options.order = order || 'desc';
            
            if (pageOptions) {
                options.options = pageOptions
            }
        }

        return await this.instance.getPastEvents(name, options);
    }
}
