var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Observable } from 'rxjs';
import { blockConfirmationUntil } from './blockConfirmationUntil';
import { switchMap } from 'rxjs/operators';
export const waitForLog = (writeFn, eventLogFn) => Observable.create((observer) => __awaiter(this, void 0, void 0, function* () {
    const txResponse = yield writeFn;
    const blockConfirmation = blockConfirmationUntil(txResponse.txid);
    const logs = yield eventLogFn;
    blockConfirmation.pipe(switchMap(_ => logs)).subscribe(observer.next, (e) => observer.error, () => {
        observer.complete();
    });
}));
