import { setInterval } from "timers";
import Controller from "../decorators/Controller";


export class UserService {
    async findById() {
        let id = await new Promise(resolve => {
            setTimeout(() => {
                resolve(1)
            }, 500);
        })
        return id;
    }
}
