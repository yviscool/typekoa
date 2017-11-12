import 'reflect-metadata';
export default function Controller(baseRoute?: string | RegExp) {
    return (target: Function) => {
        Reflect.defineMetadata('controller:route', baseRoute, target);
    }
}

