import { SolidoSigner } from '../../core/SolidoContract';
export declare class ThorifySigner implements SolidoSigner {
    private thor;
    private fn;
    private from;
    gas: number;
    gasPriceCoef: number;
    constructor(thor: any, fn: any, from: any, options: any);
    requestSigning(): Promise<any>;
}
