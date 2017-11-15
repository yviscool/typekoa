import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import ClassUtil from './ClassUtil';
import BeanHelper from './BeanHelper';
import ControllerHelper from './ControllerHelper';
import Controller from './Controller';
import Klass from './Klass';
import Handler from './Handler';
import Params from './Params';


export class Application {

    private _app: Koa;
    private _controller: Map<Klass, Controller>;
    constructor() {
        this._app = new Koa();
    }

    async init() {
        await ClassUtil.init();
        let beanHelper = new BeanHelper();
        await beanHelper.initBeanMap();
        let controllerHelper = new ControllerHelper();
        controllerHelper.bean = beanHelper.bean;
        await controllerHelper.init();
        this._controller = controllerHelper.bean;
        // console.log(this._controller);
        console.warn('init success');
    }

    async loadMiddleware() {
        this._app.use(bodyParser());
    }

    async loadRouter() {

        let rootRouter = new Router();
        // 遍历 controller
        [...this._controller.values()].forEach(controller => {
            let commonRouter = new Router();
            let baseUrl = controller.baseUrl;
            let controllerInstance = controller.instance;
            console.log(controller);
            //遍历 handlers
            [...controller.handlers.entries()].forEach(([action, handler]) => {
                let klass = handler.type;
                let { requestMethod, requestPath } = handler.request;
                // console.log(requestMethod, requestPath);
                // let params = [requestPath, controllerInstance[action].bind(controllerInstance)];
                // router.get('/',async()=>{})
                let invokeMethod = generMethod(handler.paramTypes, controllerInstance, klass, action);
                let params = [requestPath, invokeMethod];
                commonRouter[requestMethod].apply(commonRouter, params);
            })
            rootRouter.use(baseUrl, commonRouter.routes());
        })
        this._app.use(rootRouter.routes())
        this._app.use(rootRouter.allowedMethods())
    }

    async start() {
        this._app.listen(3000)
    }
}


function generMethod(paramTypes: Map<string, Params>, instance: any, klass: Klass, action: string) {
    let params = paramTypes.get(action);
    let paramArr = Reflect.getMetadata('design:paramtypes', klass.prototype, action);
    // console.log(params.paramCore);
    let paramStrs = Object.keys(paramArr).map(paramIndex => {
        return params.paramCore.get(parseInt(paramIndex));
    })

    // console.log(paramStrs)
    return async function invokeMethod(ctx: Koa.Context, next: Function) {
        let params = ctx.params;
        let query = ctx.query;
        let body = ctx.request['body'];
        console.log(params, query, body);
        let paramMap: Map<string, any> = new Map();
        paramMap.set('params', params);
        paramMap.set('query', query);
        paramMap.set('body', body);
        paramMap.set('ctx', ctx);
        let instanceParams = [];
        paramStrs.forEach(paramStr => {
            paramStrs[paramStrs.indexOf(paramStr)] = paramMap.get(paramStr);
        })
        await instance[action].bind(instance).apply(instance, paramStrs)
    }
}


(async function () {
    let app = new Application();
    await app.init();
    await app.loadMiddleware();
    await app.loadRouter();
    await app.start()
})();