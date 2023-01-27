import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { ValidationError } from '../../utils/validationError'

const logger = createLogger('PATCH todos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    logger.info('todoId', todoId)
    const userId = getUserId(event)
    logger.info('userId', userId)
    const request: UpdateTodoRequest = JSON.parse(event.body)
    logger.info('request', request)

    try {
      await updateTodo(userId, todoId, request)

      return {
        statusCode: 204,
        body: ""
      }
    } catch (exception) {
      if(exception instanceof ValidationError){
        return {
          statusCode: 400,
          body: JSON.stringify({error: exception.message})
        }
      }

      return {
        statusCode: 500,
        body: JSON.stringify({error: exception})
      }
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
