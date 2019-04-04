import { ContractImport, EventFilter } from '../src/types';
import { Read } from '../src/decorators/Read';
import { GetMethod } from '../src/decorators/GetMethod';
import { GetEvents } from '../src/decorators/GetEvents';
import { Write } from '../src/decorators/Write';
import { BigNumber } from 'bignumber.js';
import { ThorifyLog } from '../src/types';

const EnergyTokenContractAbi = require('./Energy');

export const EnergyContractImport: ContractImport = {
    raw: {
        abi: EnergyTokenContractAbi.abi
    },
    address: {
        '0x27': '0x0000000000000000000000000000456E65726779',
        '0x4a': '0x0000000000000000000000000000456E65726779'
    }
};

export class EnergyTokenContract {
  
    @GetMethod({
        name: 'balanceOf',
    })
    public balanceOfMethod: () => any;

    @Write({
        name: 'transfer',
        gas: 1_190_000,
        gasPriceCoef: 0
    })
    public transferMethod: (sendTo: string, wei: BigNumber) => Promise<any>;

    @Read()
    public balanceOf: (address: string) => Promise<any>;

    @GetEvents({
        name: 'Transfer',
        blocks: {
            fromBlock: 0,
            toBlock: 'latest',
        },
        order: 'desc',
        pageOptions: { limit: 100, offset: 0 },
    })
    public getTransferEvents: (fnOptions?: EventFilter<any>) => Promise<ThorifyLog[]>;

    public get tokenName() {
        return 'VTHO';
    }
}
