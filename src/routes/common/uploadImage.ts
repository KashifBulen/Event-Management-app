import { S3Client } from '@aws-sdk/client-s3';
import { Handler } from '../../utils/make-api';
import { Upload } from '@aws-sdk/lib-storage';
import { Boom } from '@hapi/boom';
import { BAD_REQUEST } from 'http-status';
import dotenv from "dotenv";

dotenv.config();
const s3Config = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: "eu-west-1",
};

const handler: Handler<'uploadImage'> = async (request) => {
    const { image } = request;

    const imageFile = image as any
    const bucketParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: imageFile.name,
        Body: imageFile.data,
    };
    try {
        const uploadFile: any = await new Upload({
            client: new S3Client({
                credentials: {
                    accessKeyId: s3Config.accessKeyId as string,
                    secretAccessKey: s3Config.secretAccessKey as string
                },
                region: s3Config.region as string
            }),
            params: bucketParams,
            tags: [],
            queueSize: 4,
            partSize: 1024 * 1024 * 5,
            leavePartsOnError: false,
        }).done()
        return {
            imageUrl: uploadFile.Location
        }

    } catch (e) {
        console.log('error uploading image', e)
        throw new Boom('There was error uploading image', { statusCode: BAD_REQUEST })
    }
}


export default handler;




