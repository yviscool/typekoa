import { Get, Controller } from '../decorators';
import { UserService } from './user.service';

@Controller('/user')
export class User {

    constructor(private userService: UserService) { }

    @Get('add')
    async getUser(id: number) {
        let result = await this.userService.findById(id);
        console.log(result);
    }
}

