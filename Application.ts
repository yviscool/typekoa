import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import ControllerHelper from './ControllerHelper';
import Controller from './metadata/Controller';
import Klass from './metadata/Klass';
import * as Reflect from './Reflect';
import RouterUtil from './RouterUtil';

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
        this._controller = new ControllerHelper().init().bean;
        console.warn('init success');
    }

    async loadMiddleware() {
        //todo 
        this._app.use(bodyParser());
        console.log('load middleware success')
    }

    async loadRouter() {
        let rootRouter = new RouterUtil(this._controller).loadRouter().getRootRouter();
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


new Application().start()