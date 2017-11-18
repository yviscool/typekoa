import 'reflect-metadata';


interface MiddlewareOrder {
    order?: number;
}


interface Action {
    action: string;
    methods: string[];
}

type MiddlewareType = 'Action' | MiddlewareOrder | Function;


let defaultOrder = {
    order: 0,
}

export default function Middleware(actionOrapp?: MiddlewareType, actionOptions?: Action[]) {
    return (target: Function) => {
        //action  定义middleware
        if (typeof actionOrapp == 'string') {
            Reflect.defineMetadata('middleware:on:action', true, target);
        }

        // Function 也巨 使用middleware
        if (typeof actionOrapp == 'function') {
            Reflect.defineMetadata('action:use:middleware', [actionOrapp, actionOptions], target);
        }

        //app use 的 middleware
        if (actionOrapp == void 0 || typeof actionOrapp == 'object') {
            //order 
            Reflect.defineMetadata('middleware:on:app', actionOrapp || { order: 0 }, target);

        }
    }
}

// @Middleware({
//     order: 0
// })
// class Midd {
//     async use(ctx, next) {

//     }
// }


// @Middleware('Action')
// class Check {

//     async checkLogin(ctx, next) {

//     }

//     async checkNotLogin(ctx, next) {

//     }
// }

// @Middleware(Check, [
//     {
//         action: 'checkLogin',
//         path: ['/add', 'delete'],
//     },
//     {
//         action: 'checkNotlogin',
//         path: ['/add', 'delete'],
//     }
// ])
// class User {


//     async getUser() {

//     }

// }