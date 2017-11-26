import 'reflect-metadata';
export default function RestController(baseRoute?: string | RegExp) {
    //baseroute handle todo 
    return (target: Function) => {
        Reflect.defineMetadata('rest:controller:route', baseRoute || '/', target);
    }
}

