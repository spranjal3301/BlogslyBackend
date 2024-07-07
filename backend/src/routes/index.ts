import { Hono } from 'hono'
import user from './user'
import post from './posts'
import file from './fileService'


const api=new Hono();
api.route('/user',user);
api.route('/post',post);
api.route('/file',file);

api.get('*', (c) => c.text('fallback'))
api.onError((err) => { throw err; });

export default api;