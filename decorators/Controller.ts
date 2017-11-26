import 'reflect-metadata';
export default function Controller(baseRoute?: string | RegExp) {
    //baseroute handle todo 
    return (target: Function) => {
        Reflect.defineMetadata('common:controller:route', baseRoute || '/', target);
    }
}

