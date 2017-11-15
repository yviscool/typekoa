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
import * as Reflect from './Reflect';

abstract class AppTemplate {
    abstract async init();
    abstract async loadMiddleware();
    abstract async loadRouter();
    abstract async listen();
    async start() {
        try {
            await this.init()
            await this.loadMiddleware();
            await this.loadRouter();
            await this.listen()
        } catch (e) {
            throw new Error('failed to load application!')
        }
    }
}


export class Application extends AppTemplate {

    private _app: Koa;

    private _controller: Map<Klass, Controller>;

    constructor() {
        super()
        this._app = new Koa();
    }

    async init() {
        let classUtil = new ClassUtil();
        await classUtil.loadClass();
        let beanHelper = new BeanHelper();
        await beanHelper.initBeanMap(classUtil);
        let controllerHelper = new ControllerHelper();
        controllerHelper.bean = beanHelper.bean;
        await controllerHelper.init();
        this._controller = controllerHelper.bean;
        // console.log(this._controller);
        console.warn('init success');
    }

    async loadMiddleware() {
        this._app.use(bodyParser());
        console.log('load middleware success')
    }

    async loadRouter() {
        let rootRouter = new Router();
        // 遍历 controller
        [...this._controller.values()].forEach(controller => {
            let commonRouter = new Router();
            let baseUrl = controller.baseUrl;
            let controllerInstance = controller.instance;
            // console.log(controller);
            //遍历 handlers
            [...controller.handlers.entries()].forEach(([action, handler]) => {
                let klass = handler.type;
                let { method, path } = handler.request;
                let invokeMethod = generateMethod(handler.paramTypes, controllerInstance, klass, action);
                let argumentsList = [path, invokeMethod];
                commonRouter[method].apply(commonRouter, argumentsList);
                // router.get('/',async()=>{})
            })
            rootRouter.use(baseUrl, commonRouter.routes());
        })
        this._app.use(rootRouter.routes())
        this._app.use(rootRouter.allowedMethods())
        console.log('load router success');
    }

    async listen() {
        this._app.listen(3000, () => {
            console.log(`Application is listening on port 3000`);
        });
    }
}


function generateMethod(paramTypes: Map<string, Params>, instance: any, klass: Klass, action: string) {
    let paramsMap = paramTypes.get(action);
    let actionParamTypes = Reflect.getActionParamTypes(klass.prototype, action);
    let paramStrs = Object.keys(actionParamTypes).map(paramIndex => paramsMap.core.get(parseInt(paramIndex)))
    let ctxParamMap: Map<string, any> = new Map();
    // console.log(paramStrs)
    return async function invokeMethod(ctx: Koa.Context, next: Function) {
        setCtxParam(ctxParamMap, ctx);
        let argumentsList = paramStrs.reduce((argumentsList, paramStr) => {
            argumentsList[paramStrs.indexOf(paramStr)] = ctxParamMap.get(paramStr);
            return argumentsList;
        }, [])
        await instance[action].bind(instance).apply(instance, argumentsList);
    }
}


function setCtxParam(ctxParamMap: Map<string, any>, ctx: Koa.Context) {
    ctxParamMap.set('params', ctx.params);
    ctxParamMap.set('query', ctx.query);
    ctxParamMap.set('body', ctx.request['body']);
    ctxParamMap.set('ctx', ctx);
}


new Application().start()