import * as path from 'path';
import Klass from './metadata/Klass';

export default class ClassUtil {

    private _dir: string;

    private _requireOption: any;

    private _classSet: Set<Klass>;

    constructor() {
        this._dir = 'modules';
        this._requireOption = {
            dirname: path.join(__dirname, this._dir),
            filter: /^(.*?controller)\.(ts|js)$/,
            excludeDirs: new RegExp(`^\.(git|svn|node_modules)$`),
            recursive: true,
        }
        // this._klasss = [];
    }

    //加载所有modules下的所有类
    loadClass() {
        Object.values(require('require-all')(this._requireOption)).forEach(controllerObj => {
            this._classSet = new Set(Object.values(controllerObj).map(controller => controller));
        }, this)
    }

    get classSet() {
        return this._classSet;
    }
}

// ClassUtil.init()