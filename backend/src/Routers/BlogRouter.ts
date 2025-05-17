import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { createBlog, updateBlog } from '@ukeed/medium-common';
import { Hono } from 'hono'
import {  verify } from 'hono/jwt';

export const BlogRouter =new Hono<{
  Bindings:{
    DATABASE_URL:string;
    JWT_SECRET:string;
  }
  Variables:{   
    userId:number;
  }
}>();


//Middleware
BlogRouter.use("/*", async (c,next)=>{
    //Extract the user id 
    // Pass it down to the route handler
    const authHeader =c.req.header("Authorization") || "";
    try{
        const user= await verify(authHeader,c.env.JWT_SECRET);
    if(user){
        c.set("userId", Number(user.id));
        return await next();
    }else{
        c.status(403);
        return c.json({
            message:"you aren't logged in"
        })
    }
    }catch(e){
        return c.json({e},403);
    }
    
});

BlogRouter.post('/', async (c) => {
  const body = await c.req.json()
    const prisma=new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL //pulled from wrangler.jsonc | .env ?
  }).$extends(withAccelerate())
  const userId=c.get("userId")
  if (!userId) return c.json({ message: "User not authenticated" }, 403)

  const {success} = createBlog.safeParse(body);
  if(!success) return c.json({msg:"Incorrect Inputs"},411);
  try{
     const blog= await prisma.blog.create({
      data:{
        title: body.title,
        content:body.content,
        published:body.published,
        authorId:userId  //comes from the above middleware after authenticating body.user_id
      }
    })
    return c.json({
        id:blog.id
    })
}catch(e){
    return c.json({e});
}})
BlogRouter.put('/', async (c) => {
 const body = await c.req.json()
    const prisma=new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL //pulled from wrangler.jsonc | .env ?
  }).$extends(withAccelerate())

  const {success} = updateBlog.safeParse(body);
  if(!success) return c.json({msg:"Incorrect Inputs"},411);
  try{
     const blog= await prisma.blog.update({
        where:{
            id:body.id
        },
      data:{
        title: body.title,
        content:body.content,
        published:body.published
      }
    })
    return c.json({
        id:blog.id
    })
}catch(e){
    return c.json({e});
}})

// Add a Pagination {Page : 1 2 3}
BlogRouter.get('/bulk', async (c) => {
    const prisma=new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL //pulled from wrangler.jsonc | .env ?
  }).$extends(withAccelerate())
  try{
    const blogs= await prisma.blog.findMany();
    return c.json({blogs});
}catch(e){
    c.status(418);
    return c.json({e});
}})

BlogRouter.get('/:id', async (c) => {  //id passed on param
  const id = await c.req.param("id")
    const prisma=new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL //pulled from wrangler.jsonc | .env ?
  }).$extends(withAccelerate())

  // const {success} = checkParams.safeParse(id);
  // if(!success) return c.json({msg:"Incorrect Inputs"},411);
  try{
     const blog= await prisma.blog.findFirst({
      where:{
        id:Number(id)
      }
    })
    return c.json(blog);
}catch(e){
    c.status(418);
    return c.json({e});
}})




