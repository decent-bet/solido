import { SolidoTopic } from '../../core/SolidoTopic';
export declare class ThorifySolidoTopic implements SolidoTopic {
    private next;
    constructor();
    topic(value: string): this;
    or(value: any): this;
    and(value: any): this;
    get(): any[];
}
