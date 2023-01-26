import * as AWS from "aws-sdk";
import * as AWSXRAY from "aws-xray-sdk"
import { S3 } from "aws-sdk";

const XAWS = AWSXRAY.captureAWS(AWS)

export class AttachmentsAccess {

    constructor(
        private readonly s3client: S3 = new XAWS.S3({signatureVersion: 'v4'}),
        private readonly bucketName: string = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration: number = Number.parseInt(process.env.SIGNED_URL_EXPIRATION)
        )
    {}

    createPresignedUploadUrl(todoId: string): string{
        return this.s3client.getSignedUrl('putObject',
        {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: this.urlExpiration
        });
    }

    createAttachmentUrl(todoId:string): string{
        return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
    }
}