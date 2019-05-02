export interface ContractImport {
    address: any;
    raw: {
        abi: object;
    };
}
export declare type IValidationType = 'address' | 'string' | 'bignumber';
export interface IValidationParams {
    [key: string]: IValidationType;
}
export interface IMethodOrEventCall {
    name?: string;
    gas?: number;
    from?: string;
    gasPriceCoef?: number;
    validations?: IValidationParams;
}
export interface IEventFilter {
    name?: string;
    interval?: number | null;
    validations?: IValidationParams;
    skipIndices?: boolean;
}
export declare type FilterOrder = 'asc' | 'desc';
export declare type FilterRangeUnit = 'block' | 'time';
export interface FilterRange {
    unit: FilterRangeUnit;
    from: number;
    to: number;
}
export interface PageOptions {
    limit: number;
    offset: number;
}
export interface BlockOptions {
    fromBlock?: number | string;
    toBlock?: number | string;
}
export interface EventFilter<T> {
    addressCriteria?: string;
    filter?: T;
    blocks?: BlockOptions;
    order?: FilterOrder;
    range?: FilterRange;
    pageOptions?: PageOptions;
    topics?: any;
}
export interface EventFilterOptions<T> extends EventFilter<T> {
    name?: string;
}
export declare enum SolidoProviderType {
    Connex = 0,
    Thorify = 1,
    Web3 = 2
}
export interface ThorifyLog {
    event: string;
    signature: string | null;
    returnValues: any;
    address: string;
    raw: {
        data: string;
        topics: string[];
    };
    meta: {
        blockID: string;
        blockNumber: number;
        blockTimestamp: number;
        txID: string;
        txOrigin: string;
    };
    blockNumber: string;
    blockHash: string;
    transactionHash: string;
}
