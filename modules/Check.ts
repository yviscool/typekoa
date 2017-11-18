import { Middleware } from "../decorators/index";
import IMiddleware from "../IMiddleware";

@Middleware('Action')
export class Check {

    async checkLogin(ctx, next) {
        console.log('ctc执行了??');
        return next();
    }

    async checkNotLogin(ctx, next) {
        console.log('ctc执行了??');
        return next();
    }
}

