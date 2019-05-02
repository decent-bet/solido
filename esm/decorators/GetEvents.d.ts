import { EventFilterOptions } from '../types';
export declare function GetEvents<P, T>(options: EventFilterOptions<T>): (target: any, propertyKey: string) => void;
