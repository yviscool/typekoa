import { setInterval } from "timers";


export class UserService {
    async findById() {
        let id = await new Promise(resolve => {
            setTimeout(()=> {
                resolve(1)
            }, 500);
        })
        return id;
    }
}
