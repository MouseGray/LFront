export class Limiter {
    data : any;
    callback : Function;
    interval : number;
    __is_lock : boolean;
    __has_data : boolean;

    constructor(interval : number, callback : Function) {
        this.callback = callback;
        this.interval = interval;
        this.__is_lock = false;
        this.__has_data = false;
    }

    push(data : any) : void {
        this.data = data;
        if (!this.__is_lock) this.pExecute();
        else this.__has_data = true;
    }

    private pLock() : void {
        setTimeout(() => { this.pUnlock() }, this.interval);
        this.__is_lock = true;
        this.__has_data = false;
    }

    private pUnlock() : void {
        if (this.__has_data) this.pExecute();
        else this.__is_lock = false;
    }

    private pExecute() : void {
        this.pLock();
        this.callback(this.data);
    }
}