import 'jasmine';
import { ThorifySolidoTopic } from '../src/providers/thorify/ThorifySolidoTopic';
import { module } from './index';
import { EnergyTokenContract } from './EnergyContract';
import { Read } from '../src/decorators/Read';
import { IMethodOrEventCall, EventFilterOptions } from '../src/types';
import { ThorifySettings } from '../src/providers/thorify/ThorifySettings';
import { Write, GetEvents } from '../src/decorators';
const Web3 = require('web3');
const { thorify } = require('thorify');


describe('ThorifyProvider', () => {
    describe('#ThorifyPlugin', () => {
        it('should generate topics for Connex', async () => {
            const topics = new ThorifySolidoTopic();

            const seq = topics
                .topic('0xc')
                .and('0xb')
                .or('0xa')
                .get();

            expect(seq[0].length).toBe(2);
        });

        it('should create a module with contracts', async () => {
            const privateKey =
        '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65';
            const chainTag = '0x4a';
            const defaultAccount = '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed';
            const thorUrl = 'http://localhost:8669';
      
            const thor = thorify(new Web3(), thorUrl);
      
            const contracts = module.bindContracts();
            const token = contracts.getContract<EnergyTokenContract>('ThorifyToken');

            const spy = spyOn(token, 'onReady');

            token.onReady<ThorifySettings>({
                privateKey,
                thor,
                defaultAccount,
                chainTag
            });
        
            expect(contracts).not.toBe(null);
            expect(token).not.toBe(null);
            expect(spy).toHaveBeenCalled();
        });

        it('should create a Read(), execute it and return a response', async () => {
            // Mock
            const obj = {
                callMethod: jasmine.createSpy('callMethod'),
            };
            const options: IMethodOrEventCall = { };
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
                prepareSigning: jasmine.createSpy('prepareSigning').and.returnValue(Promise.resolve(signerMock)),
                getMethod: jasmine.createSpy('getMethod'),
            };
            const thunk = Write()
            thunk(obj, 'transfer');
            expect((obj as any).transfer).toBeDefined();
            (obj as any).transfer([]);
            expect(obj.getMethod.calls.count()).toBe(1);
            expect(obj.prepareSigning.calls.count()).toBe(1);
        });
        
        it('should create a GetEvents(), execute it and return a response', async () => {
            // Mock
            const obj = {
                getEvents: jasmine.createSpy('getEvents'),
            };
            const options: EventFilterOptions<any> = { };
            const thunk = GetEvents(options);
            thunk(obj, 'logNewTransfer');
            expect((obj as any).logNewTransfer).toBeDefined();
            (obj as any).logNewTransfer();
            expect(obj.getEvents.calls.count()).toBe(1);
        });
    });
});
