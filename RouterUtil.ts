import * as Router from 'koa-router';
import ControllerHelper from './ControllerHelper';
import Controller from './metadata/Controller';
import Klass from './metadata/Klass';
import ParamHelper from './ParamHelper';
import KoaHelper from './KoaHelper';

export default class RouterUtil {

    private _controller: Map<Klass, Controller>;

    private _rootRouter = new Router();

    constructor(beanMap) {
        this._controller = beanMap;
    }

    loadRouter() {
        [...this._controller.values()].forEach(controller => {
            let commonRouter = new Router();
            let baseUrl = controller.baseUrl;
            let controllerInstance = controller.instance;
            [...controller.handlers.entries()].forEach(([action, handler]) => {
                let klass = handler.type;
                let { method, path } = handler.request;
                let paramNames = ParamHelper.getParamNames(handler.paramTypes, controllerInstance, klass, action);
                let invokeMethod = KoaHelper.generateRouteMid(paramNames, controllerInstance, action);
                let argumentsList = [path, invokeMethod];
                commonRouter[method].apply(commonRouter, argumentsList);
                // router.get('/',async()=>{})
            })
            this._rootRouter.use(baseUrl, commonRouter.routes());
        })
        return this;
    }


    getRootRouter() {
        if (!this._rootRouter) {
            this._rootRouter = new Router();
        }
        return this._rootRouter;
    }
}
