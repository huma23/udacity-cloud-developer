import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";

export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
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

    async updateTodo(todoId: string, updates: TodoUpdate): Promise<void> {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId: todoId
            },
            UpdateExpression: 'set name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues:{
                ':name': updates.name,
                ':dueDate': updates.dueDate,
                ':done': updates.done
            }
        }).promise()
    }

    async deleteTodo(todoId: string): Promise<void> {
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                todoId: todoId
            }
        }).promise();
    }
}