import * as Koa from 'koa';
import * as fs from 'fs';
import * as path from 'path';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import Klass from './metadata/Klass';
import RouterUtil from './RouterUtil';
import Controller from './metadata/Controller';
import ControllerHelper from './ControllerHelper';
import MiddlewareHelper from './MiddlewareHelper';

abstract class AppTemplate {
    abstract init();
    abstract loadMiddleware();
    abstract loadRouter();
    abstract listen();
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


export default class Application extends AppTemplate {

    private app: Koa;
    private controller: Map<Klass, Controller>;
    private env: string;
    private port: string | number;

    constructor() {
        super()
        this.app = new Koa();
        this.env = process.env.NODE_ENV;
        this.port = process.env.PORT || 3000;
        ['modules',/*to add*/].forEach(item => {
            let moduleDir = path.join('./', 'modules');
            if (!fs.existsSync(moduleDir)) {
                fs.mkdirSync(moduleDir)
            }
        })
    }

    /**
     * load files 
     */
    async init() {
        global['ClassSet'] = new Set();
        Object.values(require('require-all')({
            recursive: true,
            filter: /(.+)\.(ts|js)$/,
            dirname: path.join(__dirname, 'modules'),
            excludeDirs: new RegExp(`^\.(git|svn|node_modules)$`),
        })).forEach(klassObj => {
            Object.values(klassObj).forEach(klass => {
                global['ClassSet'].add(klass)
            })
        })
        this.controller = new ControllerHelper().init().getBean();
        global['ClassSet'] && delete global['ClassSet'];
        console.log('init success');
    }

    async loadMiddleware() {
        //todo order user dedefined middleware 
        let middlewareMap: Map<Klass, Function> = new MiddlewareHelper().initAppMiddle();
        this.app.use(bodyParser());
        middlewareMap.forEach(middleware => {
            this.app.use(<any>middleware);
        })
        console.log('load middleware success')
    }

    async loadRouter() {
        let rootRouter = new RouterUtil(this.controller).loadRouter().getRootRouter();
        this.app.use(rootRouter.routes())
        this.app.use(rootRouter.allowedMethods())
        console.log('load router success');
    }

    async listen() {
        this.app.listen(this.port, () => {
            console.log(`Application is listening on port ${this.port}`);
        });
    }
}


new Application().start()