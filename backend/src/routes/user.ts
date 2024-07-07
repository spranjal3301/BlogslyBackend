import {Hono} from 'hono'
import {hashPassword} from '../middlewares/hash'
import UserService from '../db/userdb'
import {HonoVariable,createAccountSchema,loginSchema} from '../types/types'
import {
  getSignedCookie,
  setSignedCookie,
  deleteCookie,
} from 'hono/cookie'

const app=new Hono<HonoVariable>();




app.get('/me',async(c) => {
    try {
      const userTable=new UserService(c.env.DATABASE_URL);
      const id=await getSignedCookie(c,c.env.JWT_SECRET,'jwtToken');

      if(!id){
        c.status(401)
        return c.json({
          error:'Unauthorized'
        })
      }
      const user=await userTable.getUserById(id);
      if(user){
        c.status(200)
        return c.json({
          user,
          msg:'User found'
        })
      }
      
    } catch (error) {
      c.status(500)
      return c.json({
        error:error??`Internal server error`
      })
    }
})


app.post('/signup',hashPassword,async (c) => {
  try {
    const userTable=new UserService(c.env.DATABASE_URL);
    const password=c.get('passwordHash');
    const body=await c.req.json();
    const {success,error}=createAccountSchema.safeParse(body);
    if(!success){
      c.status(400)
      return c.json({
        error:'Invalid input data'
      })
    }
    const {email,name}=body;
    const user=await userTable.createUser({email,password,name});
    
    await setSignedCookie(c, 'jwtToken', user.id,c.env.JWT_SECRET)
    c.status(201)
    return c.json({
      user,
      msg:'Account created'
    })
  } 
  catch (error) {
      c.status(500)
      return c.json({
        error:error??`Internal server error`,
        msg:'Account creation failed'
      })
  }

})

app.post('/login',hashPassword,async (c) => {
  try {
    const id=await getSignedCookie(c,c.env.JWT_SECRET,'jwtToken');
    if(id){
      c.status(400)
      return c.json({
        message:'Already logged in'
      })
    }
    const userTable=new UserService(c.env.DATABASE_URL);
    const password=c.get('passwordHash');
    const body=await c.req.json();
    const {success,error}=loginSchema.safeParse(body);
    if(!success){
      c.status(400)
      return c.json({
        error,
        msg:'Invalid input data'
      })
    }
    const {email}=body;
    const user=await userTable.login({email,password});

    if(user){
      await setSignedCookie(c, 'jwtToken', user.id,c.env.JWT_SECRET)
      c.status(200)
      return c.json({
        user,
        msg:'Logged in'
      })
    }
    
  } 
  catch (error) {
    c.status(500)
    return c.json({
      error:error??`Internal server error with login`
    })
  }
})

app.put('/logout',async (c) => {
  try {
    const id=await getSignedCookie(c,c.env.JWT_SECRET,'jwtToken');
    if(!id){
      c.status(200)
      return c.json({
        message:'No Active session'
      })
    }
    deleteCookie(c, 'jwtToken');
    c.status(200)
    return c.json({
      message:'Logged out Successfully'
    })
  } 
  catch (error) {

    c.status(500)
    return c.json({
      error:error??`Internal server error with login`,
      msg:'Logout failed'
    })
  }
})






export default app;