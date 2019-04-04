import { SolidoSigner } from '../../core/SolidoContract';

export class ThorifySigner implements SolidoSigner {
    constructor(private thor: any, public payload: any) {}
    async requestSigning(): Promise<any> {
        return await this.thor.eth.sendSignedTransaction(this.payload.rawTransaction);
    }
}
