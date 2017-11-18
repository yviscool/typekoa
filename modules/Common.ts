import { Middleware } from "../decorators/index";
import IMiddleware from "../IMiddleware";
import * as Koa from 'koa';

@Middleware()
export class Common implements IMiddleware {
    async resolve(ctx: Koa.Context, next: Function) {
        console.log('koa common middleware');
        return next();
    }
}