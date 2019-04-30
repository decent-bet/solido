import { SolidoSigner } from '../../core/SolidoContract';

export class ThorifySigner implements SolidoSigner {
    gas = 0;
    gasPriceCoef = 0;
    constructor(private thor: any, private fn, private from, options) {
        this.gas = options.gas;
        this.gasPriceCoef = options.gasPriceCoef;
    }
    async requestSigning(): Promise<any> {
        return await this.fn.send({ from: this.from, gas: this.gas, gasPriceCoef: this.gasPriceCoef });
    }
}
