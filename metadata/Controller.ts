import Klass from './Klass';
import Handler from './Handler';
export default class Controller {

    private _type: Klass;

    private _instance: any;

    private _isRest: boolean;

    private _baseUrl: string | RegExp;

    private _handlers: Map<string, Handler> = new Map();


    set type(type) {
        this._type = type;
    }

    set instance(instance) {
        this._instance = instance;
    }

    set baseUrl(baseUrl) {
        this._baseUrl = baseUrl;
    }

    set handlers(handlers) {
        this._handlers = handlers;
    }

    set isRest(boole: boolean) {
        this._isRest = boole;
    }

    get isRest() {
        return this._isRest;
    }

    get type() {
        return this._type;
    }

    get instance() {
        return this._instance;
    }

    get baseUrl() {
        return this._baseUrl;
    }

    get handlers() {
        return this._handlers;
    }


}