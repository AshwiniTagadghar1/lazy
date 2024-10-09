import { Request, Response } from "express";
import { connectToDatabase } from "../lib/db";


export const helloController = async function hello(req: Request, res: Response) {
    console.log(req.url)
    try{
        const videos = await connectToDatabase();
        const allVideos = await videos.find();
        console.log(allVideos);
        res.json(allVideos);
        
    }catch(error){
        res.status(500).json({message: 'Internal Server Error'});
    }
    
}