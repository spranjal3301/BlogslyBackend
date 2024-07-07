import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {CreateAccountInput,LoginInput} from '../types/types'


class UserService{
    prisma;
    constructor(DATABASE_URL:string){
      this.prisma = new PrismaClient({
            datasourceUrl: DATABASE_URL,
        }).$extends(withAccelerate())
    }

    async createUser({email,password,name}:CreateAccountInput){
        try {
            const user=await this.prisma.user.create({
                data:{
                    email,
                    password,
                    name
                }
            })
            return user;     
        } catch (error) {
            throw error?? "email already exists";
        }
    }

    async login({email,password}:LoginInput){
        try {
            const user=await this.prisma.user.findUnique({
                where:{
                    email
                }
            })
            if(user  && user?.password===password){
                return user;
            }
            throw new Error('Invalid credentials')
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id:string){
        try {
            const user=await this.prisma.user.findUnique({
                where:{
                    id
                }
            })
            if(user){
                return user;
            }
            throw new Error('User not found')
        } catch (error) {
            throw error;
        }
    }


}

export default UserService;





