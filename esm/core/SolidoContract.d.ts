import { IMethodOrEventCall, EventFilter } from '../types';
export interface SolidoSigner {
    payload?: any;
    requestSigning(): Promise<any>;
}
export interface SolidoContract {
    address: string;
    defaultAccount: string;
    prepareSigning(methodCall: any, options: IMethodOrEventCall, args: any[]): Promise<SolidoSigner>;
    getAbiMethod(name: string): object;
    getMethod<T>(name: string): T;
    callMethod<T>(name: string, args: any[]): T;
    getEvent<T>(name: string): T;
    onReady<T>(settings: T): void;
    getEvents<P, T>(name: string, eventFilter?: EventFilter<T>): Promise<P[]>;
}
