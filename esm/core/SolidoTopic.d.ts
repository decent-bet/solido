export interface SolidoTopic {
    get(): any | any[];
    or(arg1: any, arg2?: any): SolidoTopic;
    and(arg1: any, arg2?: any): SolidoTopic;
    topic(arg1: any, arg2?: any): SolidoTopic;
}
