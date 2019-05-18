import { SolidoModule } from '../src/core/SolidoModule';
import { ThorifyPlugin } from '../src/providers/thorify/ThorifyPlugin';
import { ThorifySettings } from '../src/providers/thorify/ThorifySettings';
import { ConnexPlugin } from '../src/providers/connex/ConnexPlugin';
import { EnergyTokenContract, EnergyContractImport } from './EnergyContract';
import BigNumber from 'bignumber.js';
import { SolidoProviderType } from '../src';
const Web3 = require('web3');
const { thorify } = require('thorify');

// Create Solido Module
// Uses short module syntax
export const module = new SolidoModule([
    {
        name: 'Token',
        import: EnergyContractImport,
        entity: EnergyTokenContract,
        enableDynamicStubs: true
    }
], ConnexPlugin, ThorifyPlugin);

const privateKey = '0x.....';
const chainTag = '0x..';
const defaultAccount = '0x.....';
const thorUrl = 'https://your-thor-url.com';

const thor = thorify(new Web3(thorUrl), thorUrl);

const contracts = module.bindContracts({
    'thorify': {
        provider: thor,
        options: {
            privateKey,
            thor,
            defaultAccount,
            chainTag
        }
    }
});


const token = contracts.getContract<EnergyTokenContract>('ThorifyToken');
token.initialize();

(async () => {

    // Get balance using dynamic method
    const balance = await token.methods.balanceOf(defaultAccount);
    console.log(balance);

    // Get method
    const fn = await token.balanceOfMethod();
    console.log(fn);

    // Write using dynamic method
    const tx1 = await token.methods.approve('0x.....', new BigNumber(1**6))
    const tx2 = await token.methods.transfer('0x.....', new BigNumber(1**6));
    console.log(tx1, tx2);
    
    // // Events
    const events = await token.getTransferEvents({ pageOptions: { limit: 10, offset: 10 } });
    console.log(events);
})();
