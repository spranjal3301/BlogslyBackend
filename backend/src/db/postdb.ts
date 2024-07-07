import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {CreatePostInput,UpdatePostInput} from '../types/types'


export default class Postdb{
    prisma;
    constructor(DATABASE_URL:string){
      this.prisma = new PrismaClient({
            datasourceUrl: DATABASE_URL,
        }).$extends(withAccelerate())
    }

    async createPost({title,content,featureImage,status}:CreatePostInput,userId:String|any){
        try {
            const post=await this.prisma.post.create({
                data:{
                    title,
                    content,
                    featureImage,
                    status,
                    userId
                }
            })
            return post;     
        } catch (error) {
            throw new Error("Error while Creating Post");
        }
    }

    async updatePost({title,content,featureImage,status,postId}:UpdatePostInput){
        try {
            const post=await this.prisma.post.update({
                where: {
                  id:postId,
                },
                data: {
                  title,
                  content,
                  featureImage,
                  status
                },
              })  
            if(!post)throw new Error("Invalid PostId");
            return post;
        } catch (error) {
            throw new Error("Error while Updating Post");
        }
    }

    async deletePost(postId:String |any){
        try {
            if(postId==='')throw new Error("Invalid PostId");
            const deleteUser = await this.prisma.post.delete({
                where: {
                  id: postId,
                },
              })
        } catch (error) {
            throw new Error("Error while deletePost");
        }
    }

    async listPosts(){
        try {
            const posts=await this.prisma.post.findMany({
                where:{
                    status:'Active'
                }
            })
            return posts;
        } catch (error) {
            throw new Error("Error while deletePost");  
        }
    }

    async getPost(postId:String|any){
        try {
            return await this.prisma.post.findUnique({
                where:{
                    id:postId
                }
            })
        } catch (error) {
            throw new Error("Error while getPost");  
        }
    }

    async myPosts(userId:String|any){
        try {
            const posts=await this.prisma.post.findMany({
                where:{
                    userId
                }
            })
            return posts;
        } catch (error) {
            throw new Error("Error while myPosts");  
        }
    }
}