import Klass from './Klass';
export default class Params {
    private _type: Klass;
    private _action: string;
    private _paramCore: Map<number | string, any> = new Map;

    set type(type) {
        this._type = type;
    }

    set action(action) {
        this._action = action;
    }

    get type() {
        return this._type;
    }
    get action() {
        return this._action;
    }

    get paramCore() {
        return this._paramCore;
    }
}

