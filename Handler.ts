import Klass from './Klass';
// import HandlerCore from './HandlerCore';
import Request from './Request';
export default class Handler {

    private _type: Klass;
    private _action: string;
    private _returnType: any;
    private _paramTypes: any[];
    private _request: Request;
    // handlerCore: HandlerCore;
    constructor() { }

    set type(type) {
        this._type = type;
    }
    set action(action) {
        this._action = action;
    }
    set returnType(returnType: any) {
        this._returnType = returnType;
    }
    set paramTypes(paramType: any[]) {
        this._paramTypes = paramType;
    }
    set request(request: Request) {
        this._request = request;
    }

    get type() {
        return this._type;
    }
    get action() {
        return this._action;
    }
    get returnType() {
        return this._returnType;
    }
    get request() {
        return this._request;
    }
    get paramTypes() {
        return this._paramTypes;
    }

}