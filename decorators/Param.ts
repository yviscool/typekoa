import 'reflect-metadata';

export function Body(/*todo*/obj?: any) {
    return function (target, property, index?) {
        Reflect.defineMetadata('param:type:body', index, target, property);
    }
}

export function Ctx(/*todo*/obj?: any) {
    return function (target, property, index?) {
        Reflect.defineMetadata('param:type:ctx', index, target, property);
    }
}

export function Param(/*todo*/obj?: any) {
    return function (target, property, index?) {
        Reflect.defineMetadata('param:type:params', index, target, property);
    }
}


export function Query(/*todo*/obj?: any) {
    return function (target, property, index?) {
        Reflect.defineMetadata('param:type:query', index, target, property);
    }
}

//todo
export function Cookie(/*todo*/obj?: any) {
    return function (target, property, index?) {
        // Reflect.defineMetadata('param:type:query', index, target, property);
    }
}

//todo 
export function Session(/*todo*/obj?: any) {
    return function (target, property, index?) {
        // Reflect.defineMetadata('param:type:query', index, target, property);
    }
}


