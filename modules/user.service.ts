import { setInterval } from "timers";
import Controller from "../decorators/Controller";


@Controller()
export class UserService {
    constructor(private id: number) {
    }
    async findById() {
        let id = await new Promise(resolve => {
            setTimeout(() => {
                resolve(1)
            }, 500);
        })
        return id;
    }
}
