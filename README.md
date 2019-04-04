# solido
Code first contract entity mapper for Solidity based blockchains like Ethereum, Vechain, Tron


## What is solido

Solido is a contract entity mapper, which annotates a Solidity contract based from its generated ABI. Once a contract is annotated with decorators or auto generated, you can enable it to a blockchain by using a plugin vendor.

The pluggable architecture allows different scenarios:
- Server side applications can use a HSM private key based plugin to sign.
- Client side DApps can use specific client wallet like Comet or Metamask.
- Mobile Dapps

## Examples

### Setup:

```typescript
import { SolidoModule, ThorifyPlugin, ThorifyPlugin, ThorifySettings, ConnexPlugin } from '@decent-bet/solido';
import { EnergyTokenContract, EnergyContractImport } from './EnergyContract';
import Web3 from 'web3';
const { thorify } = require('thorify');

// Create Solido Module
export const module = new SolidoModule([
  {
    name: 'ConnexToken',
    import: EnergyContractImport,
    entity: EnergyTokenContract,
  },
  {
    name: 'ThorifyToken',
    import: EnergyContractImport,
    entity: EnergyTokenContract,
    enableDynamicStubs: true
  }
],  ConnexPlugin, ThorifyPlugin);

const privateKey = '0x............';
const chainTag = '0x4a';
const defaultAccount = '0x...........';
const thorUrl = 'http://localhost:8669';

const thor = thorify(new Web3(), thorUrl);

const contracts = module.bindContracts();
const token = contracts.getContract<EnergyTokenContract>('ThorifyToken');
token.onReady<ThorifySettings>({
  privateKey,
  thor,
  defaultAccount,
  chainTag
});

(async () => {
  const balance = await token.balanceOf(defaultAccount);
  console.log(balance);
})();
 
```


### GetMethod
```typescript
    class MyContractClass {
      @GetMethod({
          name: 'balanceOf',
      })
      public balanceOfMethod: () => any;
    }

    // ...
    // using the method 
    const fn = myContractClassInstance.balanceOfMethod();
    console.log(fn);
```

### Read
```typescript
    class MyContractClass {
      @Read()
      public balanceOf: (address: string) => Promise<any>;
    }

    // ...
    // using the read 
    const balance = await myContractClassInstance.balanceOf(address);
    console.log(balance);
```

### Write
```typescript
    class MyContractClass {
      @Write({
        name: 'transfer',
        gas: 1_190_000,
        gasPriceCoef: 0
      })
      public transferMethod: (sendTo: string, wei: BigNumber) => Promise<any>;
    }

    // ...
    // using the write 
    const tx = await myContractClassInstance.transferMethod('0x........', new BigNumber(1**6));
    console.log(tx);
```

### GetEvents
```typescript
    class MyContractClass {
      @GetEvents({
        name: 'Transfer',
        blocks: {
            fromBlock: 0,
            toBlock: 'latest',
        },
        order: 'desc',
        pageOptions: { limit: 10, offset: 0 },
      })
      public getTransferEvents: (fnOptions?: EventFilter<any>) => Promise<ThorifyLog[]>;
      // The return type can by ThorifyLog or Connex.Thor.Event depending of the driver used in the contract.
    }

    // ...
    // get the events 
    // you can pass the same EventFilter object in every call to change the options
    const events = await myContractClassInstance.getTransferEvents({ pageOptions: { limit: 10, offset: 10 } });
    console.log(events);
```
  