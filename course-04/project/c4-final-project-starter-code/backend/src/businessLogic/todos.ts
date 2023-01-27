import * as uuid from 'uuid'

import { TodosAccess } from '../dataLayer/todosAccess';
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { ValidationError } from '../utils/validationError';

const dataAccess = new TodosAccess()

export async function getTodos(userId: string) : Promise<TodoItem[]> {
    return dataAccess.getTodos(userId)
}

export async function createTodo(userId: string, createRequest: CreateTodoRequest): Promise<TodoItem> {
    
    if(isNullOrEmpty(createRequest.name)){
        throw new ValidationError("name is empty");
    }

    const id = uuid.v4()
    
    return await dataAccess.createTodo({
        userId: userId,
        todoId: id,
        createdAt: new Date().toDateString(),
        done: false,
        attachmentUrl: null,
        ...createRequest
    })
}

export async function updateTodo(userId: string, todoId: string, updateRequest: UpdateTodoRequest) : Promise<void> {
    
    if(isNullOrEmpty(updateRequest.name)){
        throw new ValidationError("name is empty");
    }
    
    return dataAccess.updateTodo(userId, todoId, {...updateRequest})
}

export async function deleteTodo(userId: string, todoId: string) : Promise<void>{
    return dataAccess.deleteTodo(userId, todoId)
}

function isNullOrEmpty(input: string): boolean{
    return input == null || input === "";
}