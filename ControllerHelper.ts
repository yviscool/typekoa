import BeanHelper from './BeanHelper';
import Controller from './metadata/Controller';
import Request from './metadata/Request';
import Handler from './metadata/Handler';
import Params from './metadata/Params';
import Klass from './metadata/Klass';
import * as Reflect from './util/Reflect';
import { isParamDecorator, getParamDecorator } from './util/Common';

export default class ControllerHelper {

    private BEAN_MAP: Map<Klass, Controller>;

    constructor() {
        this.BEAN_MAP = new BeanHelper().bean;
    }

    init() {
        for (let [klass, instance] of this.BEAN_MAP) {
            let controller = new Controller();
            let baseRoute = Reflect.getBaseRoute(klass) || '/';
            let isRest = Reflect.isRestController(klass);
            let handlerMap = this.initHandlerMap(klass);
            controller.type = klass;
            controller.baseUrl = baseRoute;
            controller.instance = instance;
            controller.handlers = handlerMap;
            controller.isRest = isRest;
            this.BEAN_MAP.set(klass, controller);
        }
        return this;
    }

    initHandlerMap(klass: Klass) {
        return Reflect.getControllerAction(klass).reduce((handlerMap, action) => {
            let handler = new Handler();
            let request = new Request();
            let params = this.initParam(klass, <any>action);
            let paramTypes = Reflect.getParamtypes(klass.prototype, <any>action);
            let returnType = Reflect.getReturnType(klass.prototype, <any>action);
            let methodAndPath = Reflect.getMethodAndPath(klass.prototype, <any>action);
            let [method, path] = methodAndPath ? methodAndPath.split(':') : ['get', `/${action}`];
            handler.type = klass;
            request.path = path;
            request.method = method;
            handler.action = <any>action;
            handler.request = request;
            handler.returnType = returnType;
            handler.paramTypes = new Map<string, Params>().set(<any>action, params);
            handlerMap.set(<any>action, handler);
            return handlerMap;
        }, new Map())
    }

    initParam(klass: Klass, action: string) {
        let params = new Params();
        let paramMetadataKeys = Reflect.getParamMetadataKeys(klass.prototype, action).filter(isParamDecorator);
        paramMetadataKeys.forEach(paramMetadataKey => {
            let paramIndex = Reflect.getParamIndex(paramMetadataKey, klass.prototype, action);
            let paramDecorator = getParamDecorator(paramMetadataKey);
            params.core.set(paramIndex, paramDecorator);
        })
        params.type = klass;
        params.action = action;
        return params;
    }

    getBean() {
        return this.BEAN_MAP;
    }


}

