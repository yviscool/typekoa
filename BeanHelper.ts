import Klass from './metadata/Klass';
import * as Reflect from './Reflect';
import ClassHelper from './ClassHelper';
import ClassUtil from './ClassUtil';
import Controller from './metadata/Controller';

export default class BeanHelper {

    private BEAN_MAP: Map<Klass, Controller> = new Map();
    private CLASS_SET: Set<Klass>;
    private classHelper = ClassHelper;

    constructor() {
        let classUtil = ClassUtil.getInstance();
        this.CLASS_SET = classUtil.getControllerClass() || new Set();
    }

    //初始化beanmap, klass为类,any为对应对象,service自动注入
    init() {
        this.CLASS_SET.forEach(klass => {
            this.BEAN_MAP.set(klass, this.classHelper.getClassInstance(klass));
        })
        return this;
    }

    get bean(): Map<Klass, any> {
        return this.BEAN_MAP;
    }

}
