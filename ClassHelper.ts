import * as Reflect from './Reflect';
import ClassUtil from './ClassUtil';
import Klass from './metadata/Klass';

export default class ClassHelper {

    static getClassInstance(klass: Klass) {
        return this.getContructorParamInstance(klass);
    }

    static getContructorParamInstance(klass: Klass) {
        //todo  service 里面 变量的注入
        let instances = [];
        let paramKlassList = Reflect.getConstructorParamtypes(klass)
        if (paramKlassList) {
            instances = paramKlassList.map(service => new (service.bind.apply(service, [])))
        }
        return new (klass.bind.apply(klass, []))(...instances);
    }
}

