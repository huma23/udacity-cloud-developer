import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'

import { getTodos } from '../../businessLogic/todos'
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    const userId = getUserId(event)
    const todos = await getTodos(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({items: todos})
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
