const pattern = /^param:type:(.+)/;

let isParamDecorator = (str: string) => pattern.test(str);

let getParamDecorator = (str: string) => str.match(pattern)[1];








export {
    isParamDecorator,
    getParamDecorator,
}