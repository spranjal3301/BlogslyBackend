import { Hono } from 'hono'
import api from './routes'



const app = new Hono()


app.route('/api/v1',api);
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app;
