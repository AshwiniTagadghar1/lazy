import express, { Request, Response } from 'express';
import cors from 'cors';
import { checkBucketExists, minioClient, } from './lib/minio';
import { connectToDatabase } from './lib/db';
import { helloController } from './controller/hello';
import { getVideo } from './controller/videoController';
import multer from 'multer';


const app = express();
const port = 3001;
const bucketName = "youtube-videos";


// Connect to the database
connectToDatabase();

app.use(cors());

app.get('/api/v1/videos/:videoName', getVideo);

app.get('/api/v1/hello', helloController);

checkBucketExists(bucketName).then(res => {
    if (res) {
        const stream = minioClient.listObjectsV2(bucketName, '', true, '');
        stream.on('data', function (obj) {
            console.log('Object: ', obj);
        });
        stream.on('error', function (err) {
            console.error('Error listing objects:', err);
        });
    } else {
        console.log(`${bucketName} doesn't exist!`);
    }
}).catch(err => {
    console.error(err);
})

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});

