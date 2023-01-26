import * as AWS from "aws-sdk";
import * as AWSXRAY from "aws-xray-sdk"

import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";

const XAWS = AWSXRAY.captureAWS(AWS)

export class TodosAccess {

    constructor(
        private readonly docClient : DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX
    ){}

    async getTodos(userId: string): Promise<TodoItem[]>{
        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.todosCreatedAtIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();

        const todos = result.Items as TodoItem[];
        return todos
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        return todoItem
    }

    async updateTodo(userid: string, todoId: string, updates: TodoUpdate): Promise<void> {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId: userid,
                todoId: todoId
            },
            UpdateExpression: 'set done = :done',
            ExpressionAttributeValues:{
                ':done': updates.done
            }
        }).promise()
    }

    async updateTodoUrl(userid: string, todoId: string, url: string): Promise<void> {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId: userid,
                todoId: todoId
            },
            UpdateExpression: 'set attachmentUrl = :url',
            ExpressionAttributeValues:{
                ':url': url
            }
        }).promise()
    }

    async deleteTodo(userId: string, todoId: string): Promise<void> {
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                todoId: todoId,
                userId: userId
            }
        }).promise();
    }
}