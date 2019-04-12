// eslint-disable-next-line spaced-comment
/// <reference types="@vechain/connex" />

import { Observable, Observer } from 'rxjs';

/**
 * blockConfirmationUntil operator waits until transaction is confirmed
 * @param transactionId transaction id
 */
export const blockConfirmationUntil$ = (transactionId: string) =>
    Observable.create(async (observer: Observer<boolean>) => {
        let block: Connex.Thor.Block = await connex.thor.block().get();
        let hasBlock = await connex.thor.transaction(transactionId).get();
        while (!hasBlock) {
            await connex.thor.ticker().next();
            block = await connex.thor.block().get();
            hasBlock = await connex.thor.transaction(transactionId).get();
        }
        observer.next(!!hasBlock);
        observer.complete();
    });


export const blockConfirmationUntil = (transactionId: string) => blockConfirmationUntil$(transactionId).toPromise();