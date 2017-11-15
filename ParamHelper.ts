import ClassUtil from './ClassUtil';
import Klass from './Klass';
import 'reflect-metadata';
import * as User from './modules/user.controller';
import Params from './Params';
import * as Param from './decorators/Param';

export default class ParamHelper {
    static initParam(klass: Klass, action: string) {
        let paramMetadataKeys = Reflect.getOwnMetadataKeys(klass.prototype, action).filter(isParamDecorator)
        let params = new Params();
        params.action = action;
        params.type = klass;
        paramMetadataKeys.forEach(paramMetadataKey => {
            let paramIndex = Reflect.getOwnMetadata(paramMetadataKey, klass.prototype, action)
            let paramDecorator = getParamDecorator(paramMetadataKey);
            params.paramCore.set(paramIndex, paramDecorator)
        })
    }
}


let pattern = /^param:type:(.+)/;

let isParamDecorator = (() => {
    return (str: string) => pattern.test(str);
})()

let getParamDecorator = (() => {
    return (str: string) => str.match(pattern)[1];
})()

function descoratorFactory(paramDecorator) {
    paramDecorator = titleize(paramDecorator)
}

function titleize(str) {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, c => c.toUpperCase());
}

ParamHelper.initParam(User.User, 'getUser')