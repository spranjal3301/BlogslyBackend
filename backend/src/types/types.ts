import {z} from 'zod';

export type HonoVariable = {
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET:string
    },
    Variables:{
        passwordHash:string,
        userTable:any,
        user:User,
        userId:string
    }
}

export type User = {
    id:string,
    email:string,
    password:string,
    name:string
}

export const createAccountSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    name: z.string().min(2, "Name must be at least 2 characters long"),
  });
  
export  const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  });

export const createPostSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
    content: z.string().min(1, "Content is required"),
    featureImage: z.string(),
    status: z.enum(["Active", "Inactive"], {
      errorMap: () => ({ message: "Status must be either 'Active' or 'Inactive'" })
    })
  });

export const updatePostSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less").optional(),
    content: z.string().min(1, "Content is required").optional(),
    featureImage: z.string().optional(),
    status: z.enum(["Active", "Inactive"], {
      errorMap: () => ({ message: "Status must be either 'Active' or 'Inactive'" })
    }).optional(),
    postId:z.string()
  });
  
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;  
export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type LoginInput = z.infer<typeof loginSchema>;