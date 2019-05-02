import { SolidoTopic } from '../../core/SolidoTopic';
export declare class ConnexSolidoTopic implements SolidoTopic {
    private next;
    constructor();
    address(address: string): this;
    topic(at: number, value: string): this;
    or(index: any, value: any): this;
    and(index: any, value: any): this;
    get(): any | any[];
}
