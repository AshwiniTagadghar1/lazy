import { Request, Response } from "express";
import { minioClient } from '../lib/minio'; // Adjust the path as needed
import multer from 'multer';
const bucketName = 'youtube-videos'; // Ensure you set your bucket name here

interface VideoParams {
    videoName: string;
    description: string;
    filesize: number;
}

type FileStats = Omit<VideoParams, 'videoName'>
type Desc = Pick<VideoParams, 'description'>
type FileSize = Omit<VideoParams, 'videoName'|'description'>



// interface multerRequest extends Request{
//     file: Express.Multer.file;
// }

export const getVideo = async (req: Request<VideoParams>, res: Response) => {
    const { videoName } = req.params;

    try {
        const dataStream = await minioClient.getObject(bucketName, videoName);
        let size = 0;

        res.set({
            'Content-Type': 'video/mp4',
            'Content-Disposition': `inline; filename="${videoName}"`,
        });

        dataStream.on('data', (chunk) => {
            size += chunk.length;
        });

        dataStream.on('end', () => {
            console.log('Video streaming completed. Total size = ' + size);
        });

        dataStream.on('error', (err) => {
            console.error('Error streaming video:', err);
            res.status(500).send('Error streaming video');
        });

        // Pipe the video stream to the response
        dataStream.pipe(res);
    } catch (err) {
        console.error('Error fetching video:', err);
        res.status(404).json({ message: 'Video not found' });
    }
};

// export const uploadVideo = async(req: Request, res: Response) => {
//     if(!req.file)
//         return res.status(400).json({message: 'No file uploaded'})
//     const videoFile = req.file;
// }
const storages = multer.memoryStorage();
export const upload = multer({ storage: storages });

// Extend the Request type to include the file property from Multer
interface MulterRequest extends Request {
    file: Express.Multer.File;
  }

// Controller function to handle video upload

export const uploadVideos = async function (req: MulterRequest, res: Response) {
    
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });   
    return
  }
  
  const videoFile = req.file;
  const videoName = videoFile.originalname;

  try {
    // Upload the file buffer to MinIO
    await minioClient.putObject(
      bucketName,
      videoName,
      videoFile.buffer,
      videoFile.size,
      {
        'Content-Type': videoFile.mimetype,
      }
    );

    res.status(201).json({ message: `File uploaded successfully as ${videoName}` });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ message: 'Error uploading file' });
  }    
}