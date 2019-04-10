## RxJS operator tutorial

An operator is a RxJS action that defines a reactive observable in the form of `Observable.create(observer => fn)`.

### Observable operators with blockchain patterns

Most of the times, you work with blockchain calling contracts to read data or sign (write) transactions, and then you either poll the log events API or if available in your blockchain provider, subscribe to a websocket message.

With an operator, you can make the polling or subscription easier to work with.

An example operator can poll/subscribe and when it matches a transaction id, return a response in a reactive way or converting the observable to a promise.

```typescript
/**
 * blockConfirmationUntil operator waits until transaction is confirmed
 * @param transactionId transaction id
 */
export const blockConfirmationUntil = (transactionId: string) =>
    Observable.create(async (observer: Observer<boolean>) => {

        // Reads a block async
        let block: Connex.Thor.Block = await connex.thor.block().get();

        // Verifies it has the transaction id
        let hasBlock = await connex.thor.transaction(transactionId).get();

        // loop until found
        while (!hasBlock) {
            // Waits next block
            await connex.thor.ticker().next();

            // Read again
            block = await connex.thor.block().get();
            hasBlock = await connex.thor.transaction(transactionId).get();
        }

        // set next to true
        observer.next(!!hasBlock);

        // complete observer
        observer.complete();
    });

```

With Web3 based providers, polling `web3.eth.subscribe('newBlockHeaders')` and reading `contract.getPastEvents` works similar.

```typescript
/**
 * blockConfirmationUntil operator waits until transaction is confirmed
 * @param transactionId transaction id
 */
export const blockConfirmationUntil = (contract: any, transactionId: string) =>
    Observable.create(async (observer: Observer<boolean>) => {

        // Reads a block async
        let block = await web3.eth.subscribe('newBlockHeaders');

        // Verifies it has the transaction id
        // set fromBlock and toBlock using newBlockHeaders response
        let logs = await contract.events.allEvents({ fromBlock: block.number - 1, toBlock: block.number }); 
        
        let hasBlock = !!logs.find(i => i.transactionHash === transactionId);
        
        // loop until found
        while (!hasBlock) {
            // Waits next block
            let block = await web3.eth.subscribe('newBlockHeaders');

            // Read again
            logs = await contract.events.allEvents({ fromBlock: block.number - 1, toBlock: block.number }); 
            hasBlock = !!logs.find(i => i.transactionHash === transactionId);
        }

        // set next to true
        observer.next(hasBlock);

        // complete observer
        observer.complete();
    });

```

>Note: Make the operator return a Promise by default and create a separate method for observable streams, eg `blockConfirmationUntil$`

### Using an blockchain operator

```typescript
// approve
const resp = await token.approve(toAddress);
let blockConfirmation = await blockConfirmationUntil(resp.txid);

// transfer
const ether = 10 ** 18;
const transfer = await token.transfer(toAddress, new BigNumber(10_000 * ether));
blockConfirmation = await blockConfirmationUntil(transfer.txid);

// either call log for tx or receipt
```