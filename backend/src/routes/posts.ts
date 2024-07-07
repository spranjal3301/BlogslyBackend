import {Hono} from 'hono'
import { HonoVariable,createPostSchema,updatePostSchema } from '../types/types';
import { authMiddleware } from '../middlewares/auth';
import Postdb from '../db/postdb';


const app=new Hono<HonoVariable>();

//List AllPost
app.get('/bulk',async(c) => {
    try {
      const postTable=new Postdb(c.env.DATABASE_URL);
      const posts=await postTable.listPosts();
      c.status(200);
      return c.json(posts);
    } catch (error) {
      return c.json({
        msg:'Error in List AllPost'
      });
    }
})

//mypost
app.get('/me',authMiddleware,async(c) => {
  try {
    const postTable=new Postdb(c.env.DATABASE_URL);
    const userId=c.get('userId');
    const posts=await postTable.myPosts(userId);
    c.status(200);
    return c.json(posts);
  } catch (error) {
    return c.json({
      msg:'Error in fetching mypost'
    });
  }
})

//View Post
app.get('/:id',async(c) => {
  try {
    const postTable=new Postdb(c.env.DATABASE_URL);
    const postId=c.req.param('id');
    const post=await postTable.getPost(postId);
    c.status(200);
    return c.json({
      post,
      msg:'Post View'
    });
  } catch (error) {
    return c.json({
      msg:'Error in fetching post'
    });   
  }
  })

//Create Post
app.post('/',authMiddleware,async(c) => {
  try {
    const postTable=new Postdb(c.env.DATABASE_URL);
    const body=await c.req.json();
    const {success,error}=createPostSchema.safeParse(body);
    if(!success){
      c.status(400);
      return c.json({
        error:error
      })
    }
    const userId=c.get('userId');
    const post=await postTable.createPost({...body},userId);
    c.status(200);
    return c.json({
      post,
      msg:'Post Create'
    });
  } catch (error) {
    return c.json({
      msg:'Error in Create post'
    });
  }
  })

//Update Post
app.put('/:id',authMiddleware,async(c) => {
  try {
    const postTable=new Postdb(c.env.DATABASE_URL)
    const postId=c.req.param('id');
    const body=await c.req.json();
    const {success,error}=updatePostSchema.safeParse({...body,postId});
    if(!success){
      c.status(400);
      return c.json({
        error:error,
        msg:'Invalid Input'
      })
    }
    const post=await postTable.updatePost({...body,postId});
    // console.log(postId);
    c.status(200);
    return c.json({
      post,
      msg:'Post Update'
    });
  } catch (error) {
    c.status(500);
    return c.json({
      error,
      msg:'Error in Update post'
    });
  }
  })

//Delete Post
app.delete('/:id',authMiddleware,async(c) => {
  try {
    const postTable=new Postdb(c.env.DATABASE_URL);
    const postId=c.req.param('id');
    if(postId==''){
      c.status(400);
      return c.json({
        error:'PostId is required'
      })
    
    }
    const post=await postTable.deletePost(postId);
    c.status(200);
    return c.json({
      msg:'Post Delete'
    });
  } catch (error) {
    return c.json({
      msg:'Error in deleting post'
    });
  }
})

export default app;