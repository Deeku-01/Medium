import { Hono } from 'hono'
import { UserRouter } from './Routers/UserRouter';
import { BlogRouter } from './Routers/BlogRouter';

//connect to prisma without acceelerate and it should be declared in every route

//initialising hono so that it doesn't complain about the c.env type
const app = new Hono<{
  Bindings:{
    DATABASE_URL:string;
    JWT_SECRET:string;
  }
}>()

app.route('/api/v1/user',UserRouter)
app.route('/api/v1/blog',BlogRouter)


export default app
