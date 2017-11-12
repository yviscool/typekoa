import * as Koa from 'koa';

export class Application{
    
    private _app : Koa;

    constructor(){
        this._app = new Koa();
    }

    async init(){

    }

    start() {
        
    }
}