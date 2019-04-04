import { ThorifySolidoTopic } from '../src/providers/thorify/ThorifySolidoTopic';
import { module } from './index';
import { EnergyTokenContract } from './EnergyContract';
import { Read } from '../src/decorators/Read';
import { IMethodOrEventCall } from '../src/types';
import { AbiUtils } from '../src/Utils';
import { ThorifySettings } from '../src/providers/thorify/ThorifySettings';
import { Write } from '../src/decorators';
const Web3 = require('web3');
const { thorify } = require('thorify');
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
            token.onReady<ThorifySettings>({
                privateKey,
                thor,
                defaultAccount,
                chainTag
            });
      
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
                    return Promise.resolve(signerMock)
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
