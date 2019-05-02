var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Observable } from 'rxjs';
export const blockConfirmationUntil$ = (transactionId) => Observable.create((observer) => __awaiter(this, void 0, void 0, function* () {
    let block = yield connex.thor.block().get();
    let hasBlock = yield connex.thor.transaction(transactionId).get();
    while (!hasBlock) {
        yield connex.thor.ticker().next();
        block = yield connex.thor.block().get();
        hasBlock = yield connex.thor.transaction(transactionId).get();
    }
    observer.next(!!hasBlock);
    observer.complete();
}));
export const blockConfirmationUntil = (transactionId) => blockConfirmationUntil$(transactionId).toPromise();
