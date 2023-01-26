import { AttachmentsAccess } from '../dataLayer/attachmentsAccess'
import { TodosAccess } from '../dataLayer/todosAccess'
import { createLogger } from '../utils/logger'

const storageAccess = new AttachmentsAccess()
const dataAccess = new TodosAccess()

const logger = createLogger('attachements business')

export async function createPresignedUploadUrl(userId: string, todoId: string) : Promise<string> {
    const url = storageAccess.createPresignedUploadUrl(todoId)
    logger.info('created presigned url')
    const fileUrl = storageAccess.createAttachmentUrl(todoId)
    logger.info('created attachment url', fileUrl)
    await dataAccess.updateTodoUrl(userId, todoId, fileUrl)
    logger.info('updated todo item')
    return url
}