import Klass from './Klass';
import * as Reflect from './Reflect';
import ClassUtil from './ClassUtil';


// ClassUtil.init()

export default class BeanHelper {

    private BEAN_MAP: Map<Klass, any> = new Map();

    //初始化beanmap, klass为类,any为对应对象,service自动注入
    initBeanMap(classUtil: ClassUtil) {
        return Promise.resolve().then(() => {
            classUtil.klasss.forEach(klass => {
                let instances = Reflect.getConstructorParamtypes(klass).map(service => new (service.bind.apply(service, [])))
                let controllerInstance = new (klass.bind.apply(klass, []))(...instances);
                this.BEAN_MAP.set(klass, controllerInstance);
            }, this)
        })
    }

    get bean(): Map<Klass, any> {
        return this.BEAN_MAP;
    }

}
