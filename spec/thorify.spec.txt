import 'jasmine';
import { ThorifySolidoTopic } from '../src/providers/thorify/ThorifySolidoTopic';
import { module } from './index';
import { EnergyTokenContract, EnergyContractImport } from './EnergyContract';
import { Read } from '../src/decorators/Read';
import { IMethodOrEventCall, EventFilterOptions } from '../src/types';
import { ThorifySettings } from '../src/providers/thorify/ThorifySettings';
import { Write, GetEvents } from '../src/decorators';
import { SolidoModule } from '../src/core/SolidoModule';
import { ThorifyPlugin, SolidoContract, SolidoProvider } from '../src';
const Web3 = require('web3');
const { thorify } = require('thorify');

describe('ThorifyProvider', () => {
    describe('#ThorifyPlugin', () => {
        let thor;
        let tokenContract: EnergyTokenContract & SolidoContract & SolidoProvider;
        beforeEach(async () => {
            const privateKey =
        '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65';
            const chainTag = '0x4a';
            const defaultAccount = '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed';
            const thorUrl = 'http://localhost:8669';

            thor = {
                eth: {
                    Contract: function() {},
                    accounts: {
                        wallet: {
                            add: jasmine.createSpy()
                        },
                        signTransaction: jasmine.createSpy('signTransaction')
                    }
                }
            } as any;
            // Create Solido Module
            // Uses short module syntax
            const module = new SolidoModule(
                [
                    {
                        name: 'Token',
                        import: EnergyContractImport,
                        entity: EnergyTokenContract,
                        enableDynamicStubs: true
                    }
                ],
                ThorifyPlugin
            );
            const contracts = module.bindContracts();
            const token = contracts.getContract<EnergyTokenContract>('ThorifyToken');
            expect(contracts).not.toBe(null);
            expect(token).not.toBe(null);

            tokenContract = token;

            token.onReady<ThorifySettings>({
                privateKey,
                thor,
                from: defaultAccount,
                chainTag
            });

            expect(token.address).toBeDefined();
        });

        it('should generate topics for Connex', async () => {
            const topics = new ThorifySolidoTopic();

            const seq = topics
                .topic('0xc')
                .and('0xb')
                .or('0xa')
                .get();

            expect(seq[0].length).toBe(2);
        });

        it('should create a Read(), execute it and return a response', async () => {
            // Mock
            const obj = {
                callMethod: jasmine.createSpy('callMethod')
            };
            const options: IMethodOrEventCall = {};
            const thunk = Read(options);
            thunk(obj, 'balanceOf');
            expect((obj as any).balanceOf).toBeDefined();
            (obj as any).balanceOf();
            expect(obj.callMethod.calls.count()).toBe(1);
        });

        it('should create a Write() and return a Promise', async () => {
            const signerMock: any = {
                requestSigning: jasmine.createSpy('requestSigning')
            };
            // Mock
            const obj = {
                prepareSigning: jasmine
                    .createSpy('prepareSigning')
                    .and.returnValue(Promise.resolve(signerMock)),
                getMethod: jasmine.createSpy('getMethod')
            };
            const thunk = Write();
            thunk(obj, 'transfer');
            expect((obj as any).transfer).toBeDefined();
            (obj as any).transfer([]);
            expect(obj.getMethod.calls.count()).toBe(1);
            expect(obj.prepareSigning.calls.count()).toBe(1);
        });

        it('should prepare signing and call signTransaction', async () => {
            const methodCall =  jasmine.createSpy()
                .and.returnValue({
                    call: () => Promise.resolve(true),
                    encodeABI: () => '0x6fc82f0b3531353536323337303235000000000000000000000000000000000000000000000000000000000000000000bdca9e6d4d9c7dc7774e84c98617b40869d354680000000000000000000000000000000000000000000000000000000000000003'
                })
            const values = [0, 1, 2];
            tokenContract.prepareSigning(methodCall, {}, values)
            expect(methodCall).toHaveBeenCalled();

        });

        it('should create a GetEvents(), execute it and return a response', async () => {
            // Mock
            const obj = {
                getEvents: jasmine.createSpy('getEvents')
            };
            const options: EventFilterOptions<any> = {};
            const thunk = GetEvents(options);
            thunk(obj, 'logNewTransfer');
            expect((obj as any).logNewTransfer).toBeDefined();
            (obj as any).logNewTransfer();
            expect(obj.getEvents.calls.count()).toBe(1);
        });
    });
});
