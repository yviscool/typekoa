import Klass from '../metadata/Klass';
import 'reflect-metadata';

enum METADATA {
    CONTROLLER_ROUTE = 'controller:route',
    METHOD_PATH = 'method:path',
    PARAMTYPES = 'design:paramtypes',
    RETURNTYPE = 'design:returntype',
}

export function getReturnType(klass: Klass, action: string) {
    return Reflect.getOwnMetadata(METADATA.RETURNTYPE, klass, action);
}

export function getBaseRoute(klass: Klass) {
    return Reflect.getOwnMetadata(METADATA.CONTROLLER_ROUTE, klass);
}

export function getMethodAndPath(klass: Klass, action: string): string {
    return Reflect.getOwnMetadata(METADATA.METHOD_PATH, klass, action);
}

export function getParamtypes(klass: Klass, action: string) {
    return Reflect.getOwnMetadata(METADATA.PARAMTYPES, klass, action);
}

export function getConstructorParamtypes(klass: Klass) {
    return Reflect.getOwnMetadata(METADATA.PARAMTYPES, klass);
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

export function getUseActionMetadata(klass: Klass) {
    return Reflect.getMetadata('action:use:middleware', klass);
}

export function getActionMiddlewareMetadata(klass: Klass) {
    return Reflect.getMetadata('middleware:on:action', klass);
}

export {
    getControllerAction as getClassMethods,
    getParamtypes as getActionParamTypes,
}

function __isPrototypeFnc(klass: Klass, fnc: string | any) {
    return (typeof klass.prototype[fnc] === 'function' && fnc !== 'constructor') ? true : false;
}
