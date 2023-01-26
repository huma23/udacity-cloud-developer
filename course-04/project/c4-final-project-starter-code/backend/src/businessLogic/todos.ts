import * as uuid from 'uuid'
import { AttachmentsAccess } from '../dataLayer/attachmentsAccess';

import { TodosAccess } from '../dataLayer/todosAccess';
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const dataAccess = new TodosAccess()
const storageAccess = new AttachmentsAccess()

export async function getTodos(userId: string) : Promise<TodoItem[]> {
    return dataAccess.getTodos(userId)
}

export async function createTodo(userId: string, createRequest: CreateTodoRequest): Promise<TodoItem> {
    
    const id = uuid.v4()
    
    return await dataAccess.createTodo({
        userId: userId,
        todoId: id,
        createdAt: new Date().toDateString(),
        done: false,
        attachmentUrl: storageAccess.createAttachmentUrl(id),
        ...createRequest
    })
}

export async function updateTodo(todoId: string, updateRequest: UpdateTodoRequest) : Promise<void> {
    return dataAccess.updateTodo(todoId, {...updateRequest})
}

export async function deleteTodo(todoId: string) : Promise<void>{
    return dataAccess.deleteTodo(todoId)
}