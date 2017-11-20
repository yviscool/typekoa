import { Get, Controller, Query, Param, Ctx, Post, Body, Middleware } from '../decorators';
import { UserService } from './user.service';
import { Check } from './Check';
import { UserDto } from './UserDto';
import * as Koa from 'koa';
@Middleware(Check, [
    {
        action: 'checkLogin',
        methods: ['getUser']
    },
    {
        action: 'checkNotLogin',
        methods: ['deleteUser']
    }
])
@Controller('/user')
export class User {

    constructor(private userService: UserService) { }

    @Get('/add')
    async getUser( @Query() query, @Ctx() ctx: Koa.Context) {
        let id = await this.userService.findById()
        ctx.type = 'application/json'
        ctx.body = id;
    }

    @Post('/delete')
    async deleteUser( @Body() userDto: UserDto, @Ctx() ctx: Koa.Context) {
        ctx.type = 'application/json'
        ctx.body = JSON.stringify(userDto);
    }

    @Get('/login')
    async login() {
    }
}

