import * as path from 'path';
import Klass from './Klass';

export default class ClassUtil {

    static dir: string = 'modules';

    static requireOption: any = {
        dirname: path.join(__dirname, ClassUtil.dir),
        filter: /^(.*?controller)\.(ts|js)$/,
        excludeDirs: new RegExp(`^\.(git|svn|node_modules)$`),
        recursive: true,
    }

    static klasss: Klass[] = [];
    //加载所有modules下的所有类
    static init(): void {
        for (let [key, classObject] of Object.entries(require('require-all')(this.requireOption))) {
            for (let [key, value] of Object.entries(classObject)) {
                console.log('load', value.name);
                this.klasss.push(value)
            }
        }
    }

}



// ClassUtil.init()