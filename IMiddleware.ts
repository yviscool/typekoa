import * as Koa from 'koa';
export default interface IMiddleware {
    resolve(ctx: Koa.Context, next: Function);
}