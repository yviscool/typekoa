import 'reflect-metadata';

export function Get(route: string | RegExp) {
    return (target: any, actionName: string) => {
        defineMetadata(target, actionName, ['get', route || '/'].join(":"))
    };
}

export function Post(route: string | RegExp) {
    return (target: any, actionName: string) => {
        defineMetadata(target, actionName, ['post', route || '/'].join(":"))
    };
}

export function Put(route: string | RegExp) {
    return (target: any, actionName: string) => {
        defineMetadata(target, actionName, ['put', route || '/'].join(":"))
    };
}

export function Patch(route: string | RegExp) {
    return (target: any, actionName: string) => {
        defineMetadata(target, actionName, ['patch', route || '/'].join(":"))
    };
}

export function Delete(route: string | RegExp) {
    return (target: any, actionName: string) => {
        defineMetadata(target, actionName, ['delete', route || '/'].join(":"))
    };
}

export function Options(route: string | RegExp) {
    return (target: any, actionName: string) => {
        defineMetadata(target, actionName, ['options', route || '/'].join(":"))
    };
}

export function All(route: string | RegExp) {
    return (target: any, actionName: string) => {
        defineMetadata(target, actionName, ['all', route || '/'].join(":"))
    };
}




const defineMetadata = (() => {
    const MethodAndPath = 'method:path';
    return (target: any, actionName: string, decoratorValue: string) => {
        Reflect.defineMetadata(MethodAndPath, decoratorValue, target, actionName);
    }
})();



