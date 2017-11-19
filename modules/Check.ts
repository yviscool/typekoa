import { Middleware } from "../decorators/index";
import IMiddleware from "../IMiddleware";

@Middleware('Action')
export class Check {

    async checkLogin(ctx, next) {
        console.log('check login');
        return next();
    }

    async checkNotLogin(ctx, next) {
        console.log('check not login')
        return next();
    }
}

