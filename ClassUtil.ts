import Klass from './metadata/Klass';
import 'reflect-metadata'


/**
 * get classSet  
 * classSet is one of  [controllerClass, appMiddleClass,useActionClass]
 */
export default class ClassUtil {

    private static instance;

    private classSet: Set<Klass> = new Set();

    private constructor() {
        this.classSet = global['ClassSet']
        this.classSet && delete global['ClassSet'];
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ClassUtil();
        return this.instance;
    }

    getControllerClass() {
        let classSet: Set<Klass> = new Set();
        for (let klass of this.classSet) {
            if (Reflect.getMetadata('controller:route', klass)) {
                classSet.add(klass);
            }
        }
        return classSet;
    }

    getAppMiddleClass() {
        let classSet: Set<Klass> = new Set();
        for (let klass of this.classSet) {
            if (Reflect.getMetadata('middleware:on:app', klass)) {
                classSet.add(klass);
            }
        }
        return classSet;
    }

    getUseActionClass() {
        let classSet: Set<Klass> = new Set();
        for (let klass of this.classSet) {
            if (Reflect.getMetadata('action:use:middleware', klass)) {
                classSet.add(klass);
            }
        }
        return classSet;

    }
}

