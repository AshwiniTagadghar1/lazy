import { Client as MinioClient} from 'minio';
import * as dotenv from 'dotenv';
dotenv.config();

// Instantiate the MinIO client with the object store service
// endpoint and an authorized user's credentials
// play.min.io is the MinIO public test cluster

const accessKey = process.env.MINIO_ACCESS_KEY!;
const secretKey = process.env.MINIO_SECRET_KEY!;
const minioEndpoint = process.env.MINIO_ENDPOINT!;

export const minioClient = new MinioClient({
  endPoint: minioEndpoint,
  port: 9000,
  useSSL: false,
  accessKey,
  secretKey,
})

export async function checkBucketExists(bucketName: string): Promise<boolean> {
    try {
        return await minioClient.bucketExists(bucketName);        
    } catch (err) {
        console.error('err occured when checking bucket exists:', err)
        return false;
    }    
}
