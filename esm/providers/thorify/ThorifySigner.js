var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class ThorifySigner {
    constructor(thor, fn, from, options) {
        this.thor = thor;
        this.fn = fn;
        this.from = from;
        this.gas = 0;
        this.gasPriceCoef = 0;
        this.gas = options.gas;
        this.gasPriceCoef = options.gasPriceCoef;
    }
    requestSigning() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fn.send({ from: this.from, gas: this.gas, gasPriceCoef: this.gasPriceCoef });
        });
    }
}
