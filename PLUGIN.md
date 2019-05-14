## Provider plugin tutorial

A provider implements a SolidoContract interface for a blockchain client API (eg Connex, Thorify, Web3) and extends SolidoProvider, which attaches an ABI import to a contract entity.

### Plugin interfaces

* `SolidoContract`
* `SolidoSigner`
* `SolidoTopic`


### SolidoContract


#### address

Contract address

#### defaultAccount

Current user account


#### getAbiMethod

Gets an ABI definition

#### getMethod

Gets an instance method

#### callMethod

Gets a method execution and returns a Promise

#### getEvent

Gets an instance event

#### getEvents

Calls an event log query and returns a Promise

#### prepareSigning

Creates a signing request and returns a Promise<SolidoSigner>

#### onReady

Instantiates a contract using the provider connection settings.

### SolidoSigner

#### payload

The payload to sign

#### requestSigning

Executes a signing request and returns a Promise

### SolidoTopic

#### get

Creates a provider compatible topic query

#### or

A topic OR. Generates `['0xa', '0xb] in web3 notation.

#### and

A topic AND. Generates `['0xa',['0xb]] in web3 notation.

#### topic

Adds a topic. Called as `topic(0, '0xb') for web3 compatible providers.

### Provider settings and OnReady

Before Solido can be used in an application, you first define a bootstrapper and then connect each contract to a provider using OnReady.


1. Create module and bind ABI imports
2. Connect contract

#### Create module and bind ABI imports


```typescript
export const module = new SolidoModule([
    {
        name: 'ConnexToken',
        import: EnergyContractImport,
        entity: EnergyTokenContract,
        provider: ConnexPlugin
    },
    {
        name: 'ThorifyToken',
        import: EnergyContractImport,
        entity: EnergyTokenContract,
        provider: ThorifyPlugin
    }
]);
const contracts = module.bindContracts();
```

This module defines two contracts, each contract attach to a provider (eg Connex, Thorify, Web3).

#### Connect contract

```typescript
const token = contracts.getContract<EnergyTokenContract>('ThorifyToken');
token.onReady<ThorifySettings>({
    privateKey,
    thor,
    defaultAccount,
    chainTag
});
```

To instantiate a contract entity, call onReady and send a bag of properties (class) which the provider plugin will use to connect to a blockchain node.









