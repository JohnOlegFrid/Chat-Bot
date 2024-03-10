export interface Message {
    text: string,
    createdAt: string,
    senderName?:string,
    my?: boolean,
}

export enum LocalStorage{
    username = 'username'
}
export interface MessageFromServer extends Message {
    id: string
}

export interface Reply extends Message{
    replyToMessageId: string
}