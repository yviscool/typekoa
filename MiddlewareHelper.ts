import ClassUtil from "./ClassUtil";
import Klass from "./metadata/Klass";
import Middleware from "./decorators/Middleware";
import * as Reflect from './util/Reflect';
import * as Koa from 'koa';


export default class MiddlewareHelper {

    /**
     *  get user defined middleware , then app can use it 
     *  @returns [Map<Klass,Function>]
     *  such 
     *   common => common.resolve 
     */
    initAppMiddle() {
        let middlewareMap: Map<Klass, Function> = new Map();
        let middlewareClass = ClassUtil.getInstance().getAppMiddleClass();
        middlewareClass.forEach(klass => {
            middlewareMap.set(klass, getAppMiddleware(klass));
        })
        return middlewareMap;
        function getAppMiddleware(klass: Klass) {
            let asyncMethod = klass.prototype['resolve'];
            async function defaultMiddleware(ctx: Koa.Context, next: Function) {
                ctx.throw(`The middleware class ${klass.name} is not a middleware, please check again`);
            }
            return typeof asyncMethod === 'function' && asyncMethod !== 'constructor' ? asyncMethod : defaultMiddleware;
        }
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
            let methodNames = Reflect.getClassMethods(klass);
            let actionMap: Map<string, Function> = new Map();
            methodNames.forEach(methodName => {
                actionMap.set(<any>methodName, klass.prototype[methodName]);
            })
            actionMiddleMap.set(klass, actionMap);
        })
        return actionMiddleMap;
    }
    /**
     *  get action map
     *  @returns  [Map<Klass, Map<string, Function>>}
     *  such as 
     * Map { [Function: User] => Map {
     * 'add' => [AsyncFunction: checkLogin],
     * 'delete' => [AsyncFunction: checkLogin] } 
     * }
     */
    initAction() {
        let map: Map<Klass, Map<string, Function>> = new Map();
        let actionMiddleClass = ClassUtil.getInstance().getUseActionClass();
        actionMiddleClass.forEach(klass => {
            let actionMap: Map<string, Function> = new Map();
            let classMehods = Reflect.getClassMethods(klass);
            let [actionKlass, actionOptions] = Reflect.getUseActionMetadata(klass);
            let defaultActionMethod = Reflect.getClassMethods(actionKlass)[0];
            if (Reflect.getActionMiddlewareMetadata(actionKlass)) {
                if (actionOptions) {
                    actionOptions.forEach(metadata => {
                        let { methods, action } = metadata;
                        methods.forEach(method => {
                            actionMap.set(method, getActionMethod(actionKlass, action));
                        })
                    })
                } else {
                    classMehods.forEach(method => {
                        actionMap.set(<any>method, getActionMethod(actionKlass, <string>defaultActionMethod));
                    })
                }
            }
            map.set(klass, actionMap)
        })
        return map;
        function getActionMethod(actionKlass: Klass, actionName: string) {
            let asyncMethod = actionKlass.prototype[actionName];
            async function defaultMiddleware(ctx: Koa.Context, next: Function) {
                ctx.throw(`The middleware class ${actionKlass.name} does not have this method, please check again`);
            }
            return typeof asyncMethod === 'function' && asyncMethod !== 'constructor' ? asyncMethod : defaultMiddleware;
        }
    }
}








