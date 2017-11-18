import BeanHelper from './BeanHelper';
import Controller from './metadata/Controller';
import Request from './metadata/Request';
import Handler from './metadata/Handler';
import Params from './metadata/Params';
import Klass from './metadata/Klass';
import * as Reflect from './Reflect';

export default class ControllerHelper {

    private BEAN_MAP: Map<Klass, Controller>;

    constructor() {
        this.BEAN_MAP = new BeanHelper().init().bean;
    }

    init() {
        for (let [klass, instance] of this.BEAN_MAP) {
            let controller = new Controller();
            let baseRoute = Reflect.getBaseRoute(klass);
            let handlerMap = this.initHandlerMap(controller, klass);
            controller.type = klass;
            controller.baseUrl = baseRoute;
            controller.instance = instance;
            controller.handlers = handlerMap;
            this.BEAN_MAP.set(klass, controller);
        }
        return this;
    }

    initHandlerMap(controller: Controller, klass: Klass) {
        return Reflect.getControllerAction(klass).reduce((handlerMap, action) => {
            let handler = new Handler();
            let request = new Request();
            let params = this.initParam(klass, <any>action);
            let paramTypes = Reflect.getParamtypes(klass.prototype, <any>action);
            let returnType = Reflect.getReturnType(klass.prototype, <any>action);
            let methodAndPath = Reflect.getMethodAndPath(klass.prototype, <any>action);
            let [method, path] = methodAndPath ? methodAndPath.split(':') : 'get:/default'.split(':');
            handler.type = klass;
            handler.request = request;
            request.path = path;
            request.method = method;
            handler.action = <any>action;
            handler.paramTypes = new Map<string, Params>().set(<any>action, params);
            handler.returnType = returnType;
            handlerMap.set(<any>action, handler);
            return handlerMap;
        }, new Map())
    }

    initParam(klass: Klass, action: string) {
        let params = new Params();
        let paramMetadataKeys = Reflect.getParamMetadataKeys(klass.prototype, action).filter(isParamDecorator);
        params.action = action;
        params.type = klass;
        paramMetadataKeys.forEach(paramMetadataKey => {
            let paramIndex = Reflect.getParamIndex(paramMetadataKey, klass.prototype, action)
            let paramDecorator = getParamDecorator(paramMetadataKey);
            params.core.set(paramIndex, paramDecorator)
        })
        return params;
    }


    get bean() {
        return this.BEAN_MAP;
    }

    set bean(bean) {
        this.BEAN_MAP = bean;
    }


}

const pattern = /^param:type:(.+)/;

let isParamDecorator = (() => {
    return (str: string) => pattern.test(str);
})()

let getParamDecorator = (() => {
    return (str: string) => str.match(pattern)[1];
})()


// new ControllerHelper().init()