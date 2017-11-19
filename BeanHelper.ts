import Klass from './metadata/Klass';
import ClassUtil from './ClassUtil';
import Controller from './metadata/Controller';
import ClassHelper from './ClassHelper';
import * as Reflect from './util/Reflect';

export default class BeanHelper {

    private BEAN_MAP: Map<Klass, Controller> = new Map();

    /**
     * initialize BEAN_MAP, klass is controller class , Controller is controller object
     * service will inject
     */
    constructor() {
        let classSet = ClassUtil.getInstance().getControllerClass();
        classSet.forEach(klass => {
            this.BEAN_MAP.set(klass, ClassHelper.newInstance(klass));
        })
    }

    get bean(): Map<Klass, Controller> {
        return this.BEAN_MAP;
    }

}
