export default class Request {

    private _requestMethod: string;
    private _requestPath: string;

    set requestMethod(requestMethod) {
        this._requestMethod = requestMethod;
    }
    set requestPath(requestPath) {
        this._requestPath = requestPath;
    }

    get requestMethod() {
        return this._requestMethod;
    }
    get requestPath() {
        return this._requestPath;
    }
}