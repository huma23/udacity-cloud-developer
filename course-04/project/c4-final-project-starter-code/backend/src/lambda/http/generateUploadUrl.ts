import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createPresignedUploadUrl } from '../../businessLogic/attachments'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('GET upload-url')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    logger.info('todoId', todoId)
    const userId = getUserId(event)
    logger.info('userId', userId)

    const url = await createPresignedUploadUrl(userId, todoId)
    logger.info('url created')

    return {
      statusCode: 200,
      body: JSON.stringify({uploadUrl: url})
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
