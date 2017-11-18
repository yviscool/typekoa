import * as Router from 'koa-router';
import ControllerHelper from './ControllerHelper';
import Controller from './metadata/Controller';
import Klass from './metadata/Klass';
import ParamHelper from './ParamHelper';
import KoaHelper from './KoaHelper';
import MiddlewareHelper from './MiddlewareHelper';

export default class RouterUtil {

    private controller: Map<Klass, Controller>;

    private rootRouter = new Router();

    private actionMiddleMap: Map<Klass, Map<string, Function>> = new Map();

    constructor(beanMap) {
        this.controller = beanMap;
        this.actionMiddleMap = new MiddlewareHelper().initAction();
    }

    loadRouter() {
        [...this.controller.values()].forEach(controller => {
            let commonRouter = new Router();
            let baseUrl = controller.baseUrl;
            let controllerInstance = controller.instance;
            [...controller.handlers.entries()].forEach(([action, handler]) => {
                let klass = handler.type;
                let { method, path } = handler.request;
                let paramNames = ParamHelper.getParamNames(handler.paramTypes, controllerInstance, klass, action);
                let invokeMethod = KoaHelper.generateRouteMid(paramNames, controllerInstance, action);
                let middleware = this.actionMiddleMap.get(klass).get(action);
                let argumentsList = middleware
                    ? [path, middleware, invokeMethod]
                    : [path, invokeMethod];
                // argumentsList = argumentsList || [path, middleware, invokeMethod];
                commonRouter[method].apply(commonRouter, argumentsList);
                // router.get('/',async()=>{})
            })
            this.rootRouter.use(baseUrl, commonRouter.routes());
        })
        return this;
    }


    getRootRouter() {
        if (!this.rootRouter) {
            this.rootRouter = new Router();
        }
        return this.rootRouter;
    }
}
