import * as Reflect from './util/Reflect';
import ClassUtil from './ClassUtil';
import Klass from './metadata/Klass';

export default class ClassHelper {

    static newInstance(klass: Klass) {
        //todo  service 里面 构造函数的注入
        let instances = [];
        let paramKlassList = Reflect.getConstructorParamtypes(klass)
        if (paramKlassList) {
            instances = paramKlassList.map(service => new (service.bind.apply(service, [])))
        }
        return new (klass.bind.apply(klass, []))(...instances);
    }

}

