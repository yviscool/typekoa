import * as path from 'path';
import Klass from './Klass';

export default class ClassUtil {

    private static dir: string = 'modules';

    private static requireOption: any = {
        dirname: path.join(__dirname, ClassUtil.dir),
        filter: /^(.*?controller)\.(ts|js)$/,
        excludeDirs: new RegExp(`^\.(git|svn|node_modules)$`),
        recursive: true,
    }

    static klasss: Klass[];
    //加载所有modules下的所有类
    static init() {
        return Promise.resolve().then(() => {
            Object.values(require('require-all')(this.requireOption)).forEach(controllerObj => {
                this.klasss = Object.values(controllerObj).map(controller => controller);
            }, this)
        })
    }
}

// ClassUtil.init()