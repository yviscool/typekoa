import * as path from 'path';
import Klass from './metadata/Klass';
import 'reflect-metadata'

export default class ClassUtil {

    private static instance: ClassUtil = new ClassUtil();

    private classSet: Set<Klass> = new Set();

    private constructor() {
        //加载所有modules下的所有类
        let requireOption = {
            dirname: path.join(__dirname, 'modules'),
            filter: /(.+)\.(ts|js)$/,
            excludeDirs: new RegExp(`^\.(git|svn|node_modules)$`),
            recursive: true,
        }
        Object.values(require('require-all')(requireOption)).forEach(klassObj => {
            Object.values(klassObj).forEach(klass => {
                this.classSet.add(klass)
            })
        })

    }

    static getInstance() {
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

    getActionMiddleClass() {
        let classSet: Set<Klass> = new Set();
        for (let klass of this.classSet) {
            if (Reflect.getMetadata('middleware:on:action', klass)) {
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

// let result = new ClassUtil().getAppMiddleClass()
// console.log(result);
