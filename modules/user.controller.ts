import { Get, Controller, Query, Param, Ctx, Post, Body } from '../decorators';
import { UserService } from './user.service';

@Controller('/user')
export class User {

    constructor(private userService: UserService) { }

    @Get('/add')
    async getUser( @Param() param, @Query() query, @Ctx() ctx) {
        let result = await this.userService.findById();
        ctx.body = result;
    }

    @Post('/delete')
    async deleteUser( @Query() query, @Body() body, @Ctx() ctx) {
        ctx.body = query;
    }
}

