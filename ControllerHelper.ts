import ClassUtil from './ClassUtil';
import Klass from './Klass';
import 'reflect-metadata';
import * as Koa from "koa"
import BeanHelper from './BeanHelper';
import Controller from './Controller';
import Handler from './Handler';
import Request from './Request';
import { access } from 'fs';

// // to comment
// let beanHelper = new BeanHelper();
// beanHelper.initBeanMap()


export default class ControllerHelper {

    private BEAN_MAP: Map<Klass, Controller>;

    constructor() { }

    init() {
        return Promise.resolve().then(() => {
            for (let [klass, instance] of this.BEAN_MAP) {
                let controller = new Controller();
                let baseRoute = getBaseRouteByReflect(klass);
                controller.baseUrl = baseRoute;
                controller.instance = instance;
                controller.type = klass;
                assembleController(controller, klass);
                console.log(controller);
                this.BEAN_MAP.set(klass, controller);
            }
        })
    }


    get bean() {
        return this.BEAN_MAP;
    }
    set bean(bean) {
        this.BEAN_MAP = bean;
    }
}

function getBaseRouteByReflect(klass: Klass) {
    const metadataKey = 'controller:route';
    return Reflect.getMetadata(metadataKey, klass);
}

function getMethodAndPathByReflect(klass: Klass, action: string): string {
    const metadataKey = 'method:path';
    return Reflect.getMetadata(metadataKey, klass, action);
}

function getParamtypesByReflect(klass: Klass, action: string) {
    const metadataKey = 'design:paramtypes';
    return Reflect.getMetadata(metadataKey, klass, action);
}

function getReturnTypeByReflect(klass: Klass, action: string) {
    const metadataKey = 'design:returntype';
    return Reflect.getMetadata(metadataKey, klass, action);
}

function getControllerAction(klass: Klass) {
    return Reflect.ownKeys(klass.prototype).filter(fnc => isPrototypeFnc(klass, fnc))
}

function isPrototypeFnc(klass: Klass, fnc: string | any) {
    return (typeof klass.prototype[fnc] === 'function' && fnc !== 'constructor') ? true : false;
}

function assembleController(controller: Controller, klass: Klass) {
    getControllerAction(klass).forEach(action => {
        let handler = new Handler();
        let methodAndPath = getMethodAndPathByReflect(klass.prototype, <string>action);
        let paramTypes = getParamtypesByReflect(klass.prototype, <string>action);
        let returnType = getReturnTypeByReflect(klass.prototype, <string>action);
        let request = new Request();
        let [method, path] = methodAndPath.split(':')
        request.requestMethod = method;
        request.requestPath = path;
        handler.request = request;
        handler.action = <string>action;
        handler.type = klass;
        handler.paramTypes = paramTypes;
        handler.returnType = returnType;
        controller.handlers.set(<string>action, handler);
    })
}

// new ControllerHelper().initController()