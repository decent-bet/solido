export class ConnexSigner {
    constructor(signingService, payload) {
        this.signingService = signingService;
        this.payload = payload;
    }
    requestSigning() {
        return this.signingService.request([
            Object.assign({}, this.payload)
        ]);
    }
}
