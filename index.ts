import * as Koa from 'koa';
import * as Router from 'koa-router';

const app = new Koa();

const router = new Router();


const userRouter = new Router()
const orderRouter = new Router()

userRouter.get('/add',async function() {
    
})

userRouter.post('/get',async function() {
    
})

userRouter

router.use('/user', userRouter.routes());
router.use('/order', userRouter.routes());


app.use(router.routes())
app.use(router.allowedMethods())


app.listen(3000, () => {
    console.log('ahah');
})
