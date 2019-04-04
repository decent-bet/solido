// eslint-disable-next-line @typescript-eslint/camelcase
import { sha3_256 } from 'js-sha3';
import moment from 'moment';
import BigNumber from 'bignumber.js';

export const ETHER = 1 ** 18;

export class AbiUtils {
    static toHex(input: string) {
        // utf8 to latin1
        const s = unescape(encodeURIComponent(input));
        let h = '';
        for (let i = 0; i < s.length; i++) {
            h += s.charCodeAt(i).toString(16);
        }
        return '0x' + h;
    }

    static fromHex(input: string) {
        const h = input.replace('0x', '');
        let s = '';
        for (let i = 0; i < h.length; i += 2) {
            s += String.fromCharCode(parseInt(h.substr(i, 2), 16));
        }
        return decodeURIComponent(escape(s));
    }

    static encodeFunctionSignature(functionName: string) {
        return `0x${sha3_256(functionName).slice(0, 10)}`;
    }

    static encodeEventSignature(functionName: string) {
        return `0x${sha3_256(functionName)}`;
    }
}


export class BlockNumberDateMapper {
    constructor() {}
    public static getPastBlockNumber(currentBlock: number, date: Date) {
        const BLOCK_PERIOD = 10;

        // diff
        const now = moment();
        const query = moment(date);

        const seconds = now.diff(query, 'seconds');
        const blocks = Math.round(seconds / BLOCK_PERIOD);
        const findBlock = currentBlock - blocks;

        return findBlock;
    }
}