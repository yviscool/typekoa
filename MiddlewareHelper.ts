import ClassUtil from "./ClassUtil";
import Klass from "./metadata/Klass";
import Middleware from "./decorators/Middleware";
import * as Koa from 'koa';




export default class MiddlewareHelper {


    constructor() {

    }

    // logmiddle  resolve(Function)

    initAppMiddle() {
        let middlewareMap: Map<Klass, Function> = new Map();
        let middlewareClass = ClassUtil.getInstance().getAppMiddleClass();
        middlewareClass.forEach(klass => {
            middlewareMap.set(klass, klass.prototype['resolve']);
        })
        return middlewareMap;
    }
    /*
      [Function: Check] => Map {
	  	'checkLogin' => [AsyncFunction:],
		'checkNotLogin' => [AsyncFunction:] 
        } 
    */
    initActionMiddle() {
        let actionMiddleMap: Map<Klass, Map<string, Function>> = new Map();
        let actionMiddleClass = ClassUtil.getInstance().getActionMiddleClass()
        actionMiddleClass.forEach(klass => {
            let methodNames = Reflect.ownKeys(klass.prototype).filter(fnc => isPrototypeFnc(klass, fnc))
            let actionMap: Map<string, Function> = new Map();
            methodNames.forEach(methodName => {
                actionMap.set(<any>methodName, klass.prototype[methodName]);
            })
            actionMiddleMap.set(klass, actionMap);
        })
        return actionMiddleMap;
    }
    /**
     * Map {
    [Function: User] => Map {
        'add' => [AsyncFunction: checkLogin],
        'delete' => [AsyncFunction: checkLogin] } }
     */
    initAction() {
        let map: Map<Klass, Map<string, Function>> = new Map();
        let actionMiddleClass = ClassUtil.getInstance().getUseActionClass();
        actionMiddleClass.forEach(klass => {
            let [actionKlass, actionOptions] = Reflect.getMetadata('action:use:middleware', klass);
            let actionMap: Map<string, Function> = new Map();
            if (Reflect.getMetadata('middleware:on:action', actionKlass)) {
                actionOptions.forEach(metadata => {
                    let { methods, action } = metadata;
                    methods.forEach(method => {
                        actionMap.set(method, getActionMethod(actionKlass, action));
                    })
                })
            }
            map.set(klass, actionMap)
        })
        return map;
    }
}


function isPrototypeFnc(klass: Klass, fnc: string | any) {
    return (typeof klass.prototype[fnc] === 'function' && fnc !== 'constructor') ? true : false;
}

function getActionMethod(actionKlass: Klass, actionName: string) {
    let asyncMethod = actionKlass.prototype[actionName];
    async function defaultMiddleware(ctx: Koa.Context, next: Function) {
        ctx.throw(`The middleware class ${actionKlass.name} does not have this method, please check again`);
    }
    return typeof asyncMethod === 'function' && asyncMethod !== 'constructor' ? asyncMethod : defaultMiddleware;
}

function getAppMiddleware(klass: Klass) {
    let asyncMethod = klass.prototype['resolve'];
    async function defaultMiddleware(ctx: Koa.Context, next: Function) {
        ctx.throw(`The middleware class ${klass.name} is not a middleware, please check again`);
    }
    return typeof asyncMethod === 'function' && asyncMethod !== 'constructor' ? asyncMethod : defaultMiddleware;
}