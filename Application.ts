import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import ClassUtil from './ClassUtil';
import BeanHelper from './BeanHelper';
import ControllerHelper from './ControllerHelper';
import Controller from './Controller';
import Klass from './Klass';
import Handler from './Handler';
import { type } from 'os';

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
        console.log('init success');
    }

    async loadMiddleware() {
        this._app.use(bodyParser());
    }

    async loadRouter() {

        let rootRouter = new Router();
        [...this._controller.values()].forEach(controller => {
            let commonRouter = new Router();
            let baseUrl = controller.baseUrl;
            let controllerInstance = controller.instance;
            [...controller.handlers.entries()].forEach(([action, handler]) => {
                let a = action;
                let h = handler;
                let klass = handler.type;
                let { requestMethod, requestPath } = handler.request;
                let params = [requestPath, controllerInstance[action].bind(controllerInstance)];
                // console.log(requestMethod, requestPath);
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

async function foo(id: number) {

}

async function invokeMethod(ctx: Koa.Context, next: Function) {
    return function () {
        foo(1)
    }
}

(async function () {
    let app = new Application();
    await app.init();
    await app.loadRouter();
    await app.start()
})();