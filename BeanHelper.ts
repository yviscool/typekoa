import ClassUtil from './ClassUtil';
import Klass from './Klass';
import 'reflect-metadata';
import * as Koa from "koa"


// ClassUtil.init()

export default class BeanHelper {

    private BEAN_MAP: Map<Klass, any> = new Map();
    private classUtil = ClassUtil;

    //初始化beanmap, klass为类,any为对应对象,service自动注入
    initBeanMap() {
        return Promise.resolve().then(() => {
            this.classUtil.klasss.forEach(klass => {
                let params: any[] = [];
                let injectInstances = getConstructorParamtypes(klass);
                let instance = new (klass.bind.apply(klass, []))(...injectInstances);
                this.BEAN_MAP.set(klass, instance);
            }, this)
        })
    }

    get bean(): Map<Klass, any> {
        return this.BEAN_MAP;
    }

}

// new BeanHelper().initBeanMap()

//获取类 也就是构造函数的 参数类型
function getConstructorParamtypes(klass: Klass): any[] {
    return Reflect.getMetadata('design:paramtypes', klass).map(service => new (service.bind.apply(service, [])))
}

