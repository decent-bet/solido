/// <reference types="@vechain/connex" />
import { SolidoSigner } from '../../core/SolidoContract';
export declare class ConnexSigner implements SolidoSigner {
    private signingService;
    payload: any;
    constructor(signingService: Connex.Vendor.TxSigningService, payload: any);
    requestSigning(): Promise<any>;
}
