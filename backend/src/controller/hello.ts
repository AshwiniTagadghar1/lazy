import { Request, Response } from "express";
import { connectToDatabase } from "../lib/db";


export const helloController = async function hello(req: Request, res: Response): Promise<void> {
    console.log(req.url)
    try{
        const videos = await connectToDatabase();
        const allVideos = await videos.find();
        res.json(allVideos);        
    }catch(error){
        res.status(500).json({message: 'Internal Server Error'});
    }    
}