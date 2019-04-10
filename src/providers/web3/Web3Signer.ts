import { SolidoSigner } from '../../core/SolidoContract';

export class Web3Signer implements SolidoSigner {
    constructor(private web3: any, public payload: any) {}
    async requestSigning(): Promise<any> {
        return await this.web3.eth.sendSignedTransaction(this.payload.rawTransaction);
    }
}
