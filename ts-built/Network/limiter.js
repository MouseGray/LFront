export class Limiter {
    data;
    callback;
    interval;
    __is_lock;
    __has_data;
    constructor(interval, callback) {
        this.callback = callback;
        this.interval = interval;
        this.__is_lock = false;
        this.__has_data = false;
    }
    push(data) {
        this.data = data;
        if (!this.__is_lock)
            this.pExecute();
        else
            this.__has_data = true;
    }
    pLock() {
        setTimeout(() => { this.pUnlock(); }, this.interval);
        this.__is_lock = true;
        this.__has_data = false;
    }
    pUnlock() {
        if (this.__has_data)
            this.pExecute();
        else
            this.__is_lock = false;
    }
    pExecute() {
        this.pLock();
        this.callback(this.data);
    }
}
