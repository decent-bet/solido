import { sha3_256 } from 'js-sha3';
import moment from 'moment';
export const ETHER = 1 ** 18;
export class AbiUtils {
    static toHex(input) {
        const s = unescape(encodeURIComponent(input));
        let h = '';
        for (let i = 0; i < s.length; i++) {
            h += s.charCodeAt(i).toString(16);
        }
        return '0x' + h;
    }
    static fromHex(input) {
        const h = input.replace('0x', '');
        let s = '';
        for (let i = 0; i < h.length; i += 2) {
            s += String.fromCharCode(parseInt(h.substr(i, 2), 16));
        }
        return decodeURIComponent(escape(s));
    }
    static encodeFunctionSignature(functionName) {
        return `0x${sha3_256(functionName).slice(0, 10)}`;
    }
    static encodeEventSignature(functionName) {
        return `0x${sha3_256(functionName)}`;
    }
}
export class BlockNumberDateMapper {
    constructor() { }
    static getPastBlockNumber(currentBlock, date) {
        const BLOCK_PERIOD = 10;
        const now = moment();
        const query = moment(date);
        const seconds = now.diff(query, 'seconds');
        const blocks = Math.round(seconds / BLOCK_PERIOD);
        const findBlock = currentBlock - blocks;
        return findBlock;
    }
}
