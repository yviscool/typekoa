import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import ControllerHelper from './ControllerHelper';
import Controller from './metadata/Controller';
import Klass from './metadata/Klass';
import * as Reflect from './Reflect';
import RouterUtil from './RouterUtil';
import MiddlewareHelper from './MiddlewareHelper';

abstract class AppTemplate {
    abstract async init();
    abstract async loadMiddleware();
    abstract async loadRouter();
    abstract async listen();
    async start() {
        // try {
            await this.init()
            await this.loadMiddleware();
            await this.loadRouter();
            await this.listen()
        // } catch (e) {
        //     throw new Error('failed to load application!')
        // }
    }
}


export class Application extends AppTemplate {

    private app: Koa;

    private _controller: Map<Klass, Controller>;

    constructor() {
        super()
        this.app = new Koa();
    }

    async init() {
        this._controller = new ControllerHelper().init().bean;
        console.warn('init success');
    }

    async loadMiddleware() {
        //todo 
        let middlewareMap: Map<Klass, Function> = new MiddlewareHelper().initAppMiddle();
        this.app.use(bodyParser());
        middlewareMap.forEach(middleware => {
            this.app.use(<any>middleware);
        })
        console.log('load middleware success')
    }

    async loadRouter() {
        let rootRouter = new RouterUtil(this._controller).loadRouter().getRootRouter();
        this.app.use(rootRouter.routes())
        this.app.use(rootRouter.allowedMethods())
        console.log('load router success');
    }

    async listen() {
        this.app.listen(3000, () => {
            console.log(`Application is listening on port 3000`);
        });
    }
}


new Application().start()