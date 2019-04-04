import { module } from './index';
import { EnergyTokenContract } from './EnergyContract';
import {
    Read,
    Write,
} from '../src/decorators';
import { IMethodOrEventCall } from '../src/types';
import { AbiUtils } from '../src/Utils';
import { ConnexSolidoTopic } from '../src/providers/connex/ConnexSolidoTopic';

const abiMethod = {
    constant: false,
    inputs: [
        {
            name: '_to',
            type: 'address'
        },
        {
            name: '_amount',
            type: 'uint256'
        }
    ],
    name: 'transfer',
    outputs: [
        {
            name: 'success',
            type: 'bool'
        }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
};
const abiEvent = {
    anonymous: false,
    inputs: [
        {
            indexed: true,
            name: '_from',
            type: 'address'
        },
        {
            indexed: true,
            name: '_to',
            type: 'address'
        },
        {
            indexed: false,
            name: '_value',
            type: 'uint256'
        }
    ],
    name: 'Transfer',
    type: 'event'
};

describe('Connex Provider', () => {
    describe('#ConnexPlugin', () => {
        it('should generate topics for Connex', async () => {
            const topics = new ConnexSolidoTopic();

            const seq = topics
                .topic(0, '0xc')
                .and(1, '0xb')
                .or(2, '0xa')
                .get();

            expect(seq).toEqual([{"topic0": "0xc", "topic1": "0xb"}, {"topic2": "0xa"}]);
        });
        it('should create a module with contracts', async () => {
            // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
            const connex = {} as Connex;
            const chainTag = '0xa4';
            const defaultAccount = '0x';

            const contracts = module.bindContracts();
            const token = contracts.getContract<EnergyTokenContract>('ConnexToken');
            token.onReady({ connex, chainTag, defaultAccount });
        });

        it('should create a Read(), execute it and return a response', async () => {
            // Mock
            const obj = {
                callMethod: jest.fn(i => {})
            };
            const options: IMethodOrEventCall = {};
            const descriptor = Read(options);
            const original = {};
            const pd = descriptor(null, 'balanceOf', original);

            const promise = await pd.value.bind(obj)();
            expect(obj.callMethod.mock.calls.length).toBe(1);
        });


        it('should create a Write() and return a Promise', async () => {
            const gasMock = jest.fn();
            const requestMock = jest.fn();
            const clauseMock = jest.fn();
            const signerMock = {
                requestSigning: jest.fn()
            };
            // Mock
            const obj = {
                prepareSigning: jest.fn(() => {
                    return Promise.resolve(signerMock);
                }),
                connex: {
                    vendor: {
                        sign: jest.fn(() => {
                            return {
                                signer: signerMock,
                                gas: gasMock,
                                request: requestMock
                            };
                        })
                    }
                },
                getMethod: jest.fn(i => {
                    return {
                        asClause: clauseMock
                    };
                })
            };
            const descriptor = Write();
            const original = {};
            const pd = descriptor(null, 'transfer', original);

            await pd.value.bind(obj)();

            expect(obj.getMethod.mock.calls.length).toBe(1);
            expect(signerMock.requestSigning.mock.calls.length).toBe(1);
        });
    });
});
