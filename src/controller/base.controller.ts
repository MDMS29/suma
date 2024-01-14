export class BaseController<T> {
    public service : T
    constructor(TService : { new(): T }) {
        this.service = new TService()

        this.services()
    }

    services(){}

}