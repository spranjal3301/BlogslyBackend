import {
    getSignedCookie,
    setSignedCookie,
    deleteCookie,
  } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import {HonoVariable,User} from '../types/types'
import UserService from '../db/userdb';



export const authMiddleware=createMiddleware<HonoVariable>(async (c,next) => {
    try {
        const userTable=new UserService(c.env.DATABASE_URL);
        const userId=await getSignedCookie(c,c.env.JWT_SECRET,'jwtToken');
  
        if(!userId){
          c.status(401)
          return c.json({
            error:'Unauthorized'
          })
        }
        const user=await userTable.getUserById(userId);
        if(user){
          c.set('userId',user.id);
          await next();
        }
        
      } catch (error) {
        c.status(500)
        return c.json({
          error:error??`Internal server error`
        })
      }
})