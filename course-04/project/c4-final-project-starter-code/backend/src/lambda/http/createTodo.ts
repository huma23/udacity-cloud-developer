import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todos'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import { createLogger } from '../../utils/logger'

const logger = createLogger('POST todos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    logger.info('newTodo', newTodo)
    const userId: string = getUserId(event)
    logger.info('userId', userId)

    const createdTodo: TodoItem = await createTodo(userId, newTodo)
    logger.info('created', createdTodo)

    return {
      statusCode: 201,
      body: JSON.stringify({item: createdTodo})
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
