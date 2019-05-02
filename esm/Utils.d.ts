export declare const ETHER: number;
export declare class AbiUtils {
    static toHex(input: string): string;
    static fromHex(input: string): string;
    static encodeFunctionSignature(functionName: string): string;
    static encodeEventSignature(functionName: string): string;
}
export declare class BlockNumberDateMapper {
    constructor();
    static getPastBlockNumber(currentBlock: number, date: Date): number;
}
