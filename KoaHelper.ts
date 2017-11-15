import * as Koa from 'koa';


export default class KoaHelper {

    static generateRouteMid(paramNames: string[], instance: any, action: string) {
        return invokeMethod;
        async function invokeMethod(ctx: Koa.Context, next: Function) {
            let ctxParamMap = KoaHelper.setCtxParams(ctx);
            let argumentsList = paramNames.reduce((argumentsList, paramStr) => {
                argumentsList[paramNames.indexOf(paramStr)] = ctxParamMap.get(paramStr);
                return argumentsList;
            }, [])
            await instance[action].bind(instance).apply(instance, argumentsList);
        }

    }

    static setCtxParams(ctx: Koa.Context) {
        let ctxParamMap: Map<string, any> = new Map();
        ctxParamMap.set('ctx', ctx);
        ctxParamMap.set('params', ctx.params);
        ctxParamMap.set('query', ctx.query);
        ctxParamMap.set('body', ctx.request['body']);
        ctxParamMap.set('cookies', ctx.cookies);
        return ctxParamMap;
    }

}

