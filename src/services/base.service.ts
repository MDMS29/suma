export class BaseService<T> {
    public query : T
    constructor(TService : new() => T) {
        this.query = new TService()

        this.querys()
    }

    querys(){}

}