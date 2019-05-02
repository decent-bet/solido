import { IMethodOrEventCall } from '../types';
import { SolidoContract } from '../core/SolidoContract';
export declare function _Read(name: string, contract: SolidoContract, args: any[], options?: IMethodOrEventCall): {};
export declare function Read(options?: IMethodOrEventCall): (target: any, propertyKey: string) => void;
