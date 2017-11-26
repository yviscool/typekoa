import * as Koa from 'koa';

export default class KoaHelper {

    static generateRouteMid(paramNames: string[], instance: any, action: string) {
        return invokeMethod;
        async function invokeMethod(ctx: Koa.Context, next: Function) {
            let ctxParamMap = KoaHelper.getCtxParams(ctx);
            let argumentsList = paramNames.reduce((argumentsList, paramStr) => {
                argumentsList[paramNames.indexOf(paramStr)] = ctxParamMap.get(paramStr);
                return argumentsList;
            }, [])
            await instance[action].bind(instance).apply(instance, argumentsList);
        }

    }

    static getCtxParams(ctx: Koa.Context) {
        let ctxParamMap: Map<string, any> = new Map();
        ctxParamMap.set('ctx', ctx);
        ctxParamMap.set('body', ctx.request['body']);
        ctxParamMap.set('query', ctx.query);
        ctxParamMap.set('params', ctx.params);
        ctxParamMap.set('cookies', ctx.cookies);
        //todo session class 
        return ctxParamMap;
    }


    static getRestMiddle() {
        async function restMiddleware(ctx: Koa.Context, next: Function) {
            ctx.type = 'application/json';
            return next();
        }
        return restMiddleware;
    }

}


