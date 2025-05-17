import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import {signinInput, signupInput} from "@ukeed/medium-common"

export const UserRouter = new Hono<{
  Bindings:{
    DATABASE_URL:string;
    JWT_SECRET:string;
  }
}>();

// add in zod and password hashing
UserRouter.post('/signup', async (c) => {
  const body = await c.req.json()
  const prisma=new PrismaClient({
  datasourceUrl: c.env.DATABASE_URL //pulled from wrangler.jsonc | .env ?
}).$extends(withAccelerate())

  const {success} = signupInput.safeParse(body);
  if(!success) return c.json({msg:"Incorrect Inputs"},411);
try{
   const user= await prisma.user.create({
    data:{
      email:body.email,
      username:body.username,
      password:body.password
    }
  })

  const token=await sign({
    id: user.id
  },c.env.JWT_SECRET); //wrangler.jsonc
  return c.json({userid:user.id});

  }catch(e){
    // Return the error message in the response for debugging
    c.status(411)
    return c.text("Invalid: " + (e instanceof Error ? e.message : String(e)))
  }
  
})

UserRouter.post('/signin', async (c) => {
  const body = await c.req.json()
  const prisma=new PrismaClient({
  datasourceUrl: c.env.DATABASE_URL //pulled from wrangler.jsonc | .env ?
}).$extends(withAccelerate())

  const {success} = signinInput.safeParse(body);
  if(!success) return c.json({msg:"Incorrect Inputs"},411);
try{
   const user= await prisma.user.findFirst({
    where:{
      email:body.email,
      password:body.password,
    }
  })
  if(!user){
    c.status(403)
    return c.text("Invalid Access " )
  }

  const token=await sign({
    id: user.id
  },c.env.JWT_SECRET); //wrangler.jsonc
  return  c.json({token : token});

  }catch(e){
    // Return the error message in the response for debugging
    c.status(411)
    return c.text("Invalid: " + (e instanceof Error ? e.message : String(e)))
  }
})