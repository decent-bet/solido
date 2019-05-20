/**
 * Defines a importable contract
 */
export interface ContractImport {
    address: any;
    raw: {
        abi: object;
    };
}

export type IValidationType = 'address' | 'string' | 'bignumber';

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

export type FilterOrder = 'asc' | 'desc';

export type FilterRangeUnit = 'block' | 'time';

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
    addressCriteria?: string; // filter object

    filter?: T; // filter object

    blocks?: BlockOptions;

    order?: FilterOrder;

    range?: FilterRange;

    pageOptions?: PageOptions;

    topics?: any;
}

export interface EventFilterOptions<T> extends EventFilter<T> {
    name?: string;
}

export enum SolidoProviderType {
    Connex = 'connex',
    Thorify = 'thorify',
    Web3 = 'web3',
    Ethers = 'ethers'
}


// thorify

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