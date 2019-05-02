// eslint-disable-next-line @typescript-eslint/camelcase
import moment from 'moment';
export const ETHER = 1 ** 18;

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