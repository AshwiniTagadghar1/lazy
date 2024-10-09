import { Request, Response } from 'express';
import { minioClient } from '../lib/minio'; // Adjust the path as needed
const bucketName = 'youtube-videos'; // Ensure you set your bucket name here

interface VideoParams {
    videoName: string;
}

export const getVideo = async (req: Request<{ videoName: string }>, res: Response) => {
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
