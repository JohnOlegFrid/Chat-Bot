import messageModel from '../models/message.model';

export async function getRepliesByMessageId (qid: string) {
    const ans = await messageModel.getRepliesByMessageId(qid);
    return ans;
}

export async function getMessages (pageSize:number, pageNumber:number) {
    const ans = await messageModel.getMessages(pageNumber,pageSize);
    return ans;
}

export async function addReply(messageId: string, text:string, username:string) {
    const ans = await messageModel.addReply(messageId, text, username);
    return ans;
}

export async function getRepliesToSimilarMessages(text:string){
    const similarmessages = await messageModel.findSimilarMessages(text);
    if (!similarmessages.length) return null;
    let replies = await messageModel.getRepliesByMessageId(similarmessages[0].id!);
    return replies;
}

export async function deleteIndices(indeces: string[]){
    return messageModel.deleteIndices(indeces);
}