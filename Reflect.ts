import Klass from './Klass';
import 'reflect-metadata';

enum METADATA {
    CONTROLLER_ROUTE = 'controller:route',
    METHOD_PATH = 'method:path',
    PARAMTYPES = 'design:paramtypes',
    RETURNTYPE = 'design:returntype',
}



export function getReturnType(klass: Klass, action: string) {
    return Reflect.getMetadata(METADATA.RETURNTYPE, klass, action);
}

export function getBaseRoute(klass: Klass) {
    return Reflect.getMetadata(METADATA.CONTROLLER_ROUTE, klass);
}

export function getMethodAndPath(klass: Klass, action: string): string {
    return Reflect.getMetadata(METADATA.METHOD_PATH, klass, action);
}

export function getParamtypes(klass: Klass, action: string) {
    return Reflect.getMetadata(METADATA.PARAMTYPES, klass, action);
}

export function getActionParamTypes(klass: Klass, action: string) {
    return Reflect.getOwnMetadata(METADATA.PARAMTYPES, klass, action);
}
export function getConstructorParamtypes(klass: Klass) {
    return Reflect.getMetadata(METADATA.PARAMTYPES, klass);
}

export function getParamMetadataKeys(klass: Klass, action: string) {
    return Reflect.getOwnMetadataKeys(klass, action)
}

export function getControllerAction(klass: Klass) {
    return Reflect.ownKeys(klass.prototype).filter(fnc => __isPrototypeFnc(klass, fnc))
}

export function getParamIndex(paramMetadataKey: string, klass: Klass, action: string) {
    return Reflect.getOwnMetadata(paramMetadataKey, klass, action);
}


function __isPrototypeFnc(klass: Klass, fnc: string | any) {
    return (typeof klass.prototype[fnc] === 'function' && fnc !== 'constructor') ? true : false;
}
