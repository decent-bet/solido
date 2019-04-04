import { SolidoTopic } from '../../core/SolidoTopic';

export class ConnexSolidoTopic implements SolidoTopic {
    private next: any = {};
    constructor() {}

    address(address: string) {
        this.next = { address: address };
        return this;
    }

    topic(at: number, value: string) {
        this.next = { [`topic${at}`]: value };
        return this;
    }

    or(index, value) {
        if (this.next.length > 0) {
            this.next = [...this.next, { [`topic${index}`]: value }];
        } else {
            this.next = [this.next, { [`topic${index}`]: value }];
        }
        return this;
    }

    and(index, value) {
        if (this.next.length > 0) {
            const obj = {};
            this.next.forEach(i => {
                const keys = Object.keys(i);
                obj[keys[0]] = i[keys[0]];
            });
            this.next = [obj, { [`topic${index}`]: value }];
        } else {
            this.next = [Object.assign(this.next, { [`topic${index}`]: value })];
        }
        return this;
    }
    get(): any | any[] {
        if (this.next.length > 0) {
            return this.next;
        } else {
            return [this.next];
        }
    }
}
