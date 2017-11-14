import { Get, Controller } from '../decorators';
import { UserService } from './user.service';

@Controller('/user')
export class User {

    constructor(private userService: UserService) { }

    @Get('/add')
    async getUser(ctx, next: Function) {
        // console.log(ctx,next,'getUser');
        let result = await this.userService.findById(1);
        console.log(result);
    }

    @Get('/delete')
    async deleteUser(ctx){
        ctx.body = 'delete'
    }
}

