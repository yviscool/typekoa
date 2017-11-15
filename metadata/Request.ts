export default class Request {

    private _method: string;
    private _path: string;

    set method(requestMethod) {
        this._method = requestMethod;
    }
    set path(requestPath) {
        this._path = requestPath;
    }

    get method() {
        return this._method;
    }
    get path() {
        return this._path;
    }
}