import 'jasmine';
import { module } from './index';
import { EnergyTokenContract, EnergyContractImport } from './EnergyContract';
import { Read, Write, GetEvents } from '../src/decorators';
import { IMethodOrEventCall, EventFilterOptions } from '../src/types';
import { ConnexSolidoTopic } from '../src/providers/connex/ConnexSolidoTopic';
import { SolidoModule, ConnexPlugin, ThorifyPlugin, SolidoProvider, SolidoContract } from '../src';

describe('Connex Provider', () => {
    describe('#ConnexPlugin', () => {
        it('should generate topics for Connex', async () => {
            const topics = new ConnexSolidoTopic();

            const seq = topics
                .topic(0, '0xc')
                .and(1, '0xb')
                .or(2, '0xa')
                .get();

            expect(seq).toEqual([
                { topic0: '0xc', topic1: '0xb' },
                { topic2: '0xa' }
            ]);
        });

        it('should create a module with contracts', async () => {
            // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
            const connex = {} as Connex;
            const chainTag = '0xa4';
            const defaultAccount = '0x';

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
                ConnexPlugin,
                ThorifyPlugin
            );
            const contracts = module.bindContracts();
            const token = contracts.getContract<EnergyTokenContract &  SolidoContract>('ConnexToken');
            const spy = spyOn(token, 'onReady');
            token.onReady({ connex, chainTag, defaultAccount });

            expect(contracts).not.toBe(null);
            expect(token).not.toBe(null);
            expect(spy).toHaveBeenCalled();
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
