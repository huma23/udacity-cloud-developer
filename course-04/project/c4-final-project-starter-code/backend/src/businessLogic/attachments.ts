import { AttachmentsAccess } from '../dataLayer/attachmentsAccess'

//const XAWS = AWSXRay.captureAWS(AWS)
const storageAccess = new AttachmentsAccess()

export function createPresignedUploadUrl(todoId: string) : string {
    return storageAccess.createPresignedUploadUrl(todoId)
}