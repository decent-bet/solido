import { SolidoTopic } from '../../core/SolidoTopic';

export class Web3SolidoTopic  implements SolidoTopic  {
    private next = [];
    constructor() {}


    topic(value: string) {
        this.next = [...this.next, value];
        return this;
    }

    or(value) {
        this.next = [...this.next, value];
        return this;
    }

    and(value) {
        this.next = [[...this.next, value]];
        return this;
    }
    get() {
        return this.next;
    }
}
