import {Request, Response} from 'express';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();



export const createUser = async (req:Request, res:Response) =>{
    const hash = await argon2.hash(req.body.password);
    try{
        const user = await prisma.user.create({
            data:{
                username:req.body.name,
                email: req.body.email,
                password: hash,
                role: req.body.role
            }
        });
        if(user){
            res.status(200).json({msg:"user created!"})
        }
    }catch(e){
        res.status(500).json({msg:`Error: ${e}`});
    }
}


export const login = async (req:Request, res:Response)=>{
    console.log(req.body)
    const user = await prisma.user.findUnique({
        where:{
            email: req.body.email
            
        }
    });
    console.log(user)

    if(!user){      
        
        return res.status(400).json({Error:"Wrong email adress"});
    }
    else if(!await argon2.verify(user.password, req.body.password)){
        
        return res.status(400).json({Error:"Wrong password"});
    }
    console.log(user)
    const token = jwt.sign({
        id: user.id,
        name: user.username,
        role: user.role,
        email: user.email
    }, process.env.SECRET as string, {
        expiresIn: '5h'
    });
    return res.status(200).json({
        message:`Hello ${user.username}`,
        token: token
    });

}

export const update = async (req:Request, res:Response) =>{
    try{
        const user = await prisma.user.update({
            where:{
                
                id: res.locals.user.id
            },
            data:{

                username: req.body.username,
                email: req.body.email 
 
            },
         
        });
        //new token after updates?
        if(user){
            const token = jwt.sign({
                id: user.id,
                name: user.username,   
                role: user.role,
                email: user.email
            }, process.env.SECRET as string, {
                expiresIn: '5h'
            });
            return res.status(200).json({
                message:`Updated ${user.username}`,
                token: token
            });
                }
        
    }catch(e){
        res.status(500).json({msg:`Error: ${e}`});
    }
}



//delete a user only ur if you're an admin
export const deleteUser = async (req:Request, res:Response) =>{
    try{
        const admin = await prisma.user.findUnique({
            where:{
                id: res.locals.user.id,
            }
        });
        if(admin?.role=="ADMIN"){
            const user = await prisma.user.delete({
                where:{
                    id: req.body.id,
                }
            });   
            return res.status(200).json({  message:"user deleted"})
         }
        else{
            return res.status(400).json({  message:"invalid credentials"})

        }
    }catch(e){
        res.status(500).json({msg:`Error: ${e}`});
    }
}



export const getUser = async (req:Request, res:Response) =>{
    try{
        const user = await prisma.user.findUnique({
            where:{
                id: res.locals.user.id,
            }
        });

        if(user){
           
            return res.status(200).json({  message:"user found", user: user})
         }
        else{
            return res.status(400).json({  message:"invalid credentials"})

        }
    }catch(e){
        res.status(500).json({msg:`Error: ${e}`});
    }
}