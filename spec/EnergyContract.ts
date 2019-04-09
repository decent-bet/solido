import { ContractImport } from '../src/types';
import { Read } from '../src/decorators/Read';

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
    // @GetMethod({
    //   nameOrAbi: 'balanceOf',
    // })
    // public balanceOfMethod(): any {}

    // @Write({
    //   nameOrAbi: 'transfer',
    //   gas: 90_000
    // })
    // public transferMethod(sendTo: string, wei: BigNumber): any {}


  @Read()
    public balanceOf: (address: string) => string;


  // @AccountEventFilter({
  //   nameOrAbi: 'Transfer',
  //   interval: 10_000,
  // })
  // public getTransfers$(fromBlock: number, to: number, options: AccountEventFilterOptions) {
  //   return (filter: Connex.Thor.Filter<'event'>) => {
  //     filter.order('asc');

  //     return filter.apply(0, 5);
  //   };
  // }

  // @AccountEventFilter({
  //   nameOrAbi: 'Transfer',
  // })
  // public getTransfers(fromBlock: number, to: number, options: AccountEventFilterOptions) {
  //   return (filter: Connex.Thor.Filter<'event'>) => {
  //     filter
  //       .order('asc')
  //       .range({
  //         unit: 'block',
  //         from: fromBlock,
  //         to
  //       });

  //     return filter.apply(0, 5);
  //   };
  // }

  // @BlockchainEventFilter({
  //   interval: 10_000,
  //   kind: 'transfer'
  // })
  // public getAllTransfers$() {
  //   return (filter: Connex.Thor.Filter<'transfer'>) => {
  //     filter.order('asc');

  //     return filter.apply(0, 5);
  //   };
  // }


  public get tokenName() {
      return 'VTHO';
  }
}
