import Klass from './metadata/Klass';
import Params from './metadata/Params';
import * as Reflect from './util/Reflect';

export default class ParamHelper {

    static getParamNames(paramTypes: Map<string, Params>, instance: any, klass: Klass, action: string) {
        let paramsMap = paramTypes.get(action);
        let actionParamTypes = Reflect.getActionParamTypes(klass.prototype, action) || {};
        return Object.keys(actionParamTypes).map(paramIndex => paramsMap.core.get(parseInt(paramIndex)))
    }

}

