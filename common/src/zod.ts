import z from "zod";

// zod validation for backend 
export const signupInput=z.object({
    email:z.string().email(),
    username:z.string(),
    password:z.string().min(6)
})

// type of inference for frontend 
export type SignupInput = z.infer<typeof signupInput>


// For signin
export const signinInput=z.object({
    email:z.string().email(),
    password:z.string().min(6)
})

export type SigninInput = z.infer<typeof signinInput>

// For Create Blog 
export const createBlog=z.object({
    title:z.string(),
    content:z.string()
})

export type CreateBlog = z.infer<typeof createBlog>

// For Updating a Blog
export const updateBlog=z.object({
    id:z.number(),
    title:z.string(),
    content:z.string()
})

export type UpdateBlog = z.infer<typeof updateBlog>

// get /:id
export const checkParams=z.object({
    id:z.number()
})

export type CheckParams=z.infer<typeof checkParams>