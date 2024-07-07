import { createMiddleware } from 'hono/factory'
import {HonoVariable} from '../types/types'

export const hashPassword=createMiddleware<HonoVariable>(async (ctx,next) =>{
    try {
        const {email,password} =await ctx.req.json();
        const newPassword=email+password;
        const encoder = new TextEncoder();
        const data = encoder.encode(newPassword);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        ctx.set('passwordHash',passwordHash);
        await next();
    } catch (error) {
        throw "password hashing failed"
    }
})


