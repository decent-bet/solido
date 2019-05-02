import { IMethodOrEventCall } from '../types';
import { SolidoContract } from '../core/SolidoContract';
export declare function _Write(name: string, contract: SolidoContract, args: any[], options?: IMethodOrEventCall): Promise<any>;
export declare function Write(options?: IMethodOrEventCall): (target: any, propertyKey: string) => void;
