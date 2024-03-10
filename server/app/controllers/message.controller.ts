import { Response, Request, NextFunction } from "express";
import * as messageService from '../service/message.service';

export const getRepliesByMessageId = async (req:Request, res: Response, next: NextFunction) => {
    const messageId = req.params.qid;
    const ans = await messageService.getRepliesByMessageId(messageId);
    res.send(ans);
    next();
}


export const getMessages = async (req:Request, res: Response, next: NextFunction) => {
    const [pageSize, pageNumber] = [req.query.pageSize,req.query.pageNumber]; 
    const ans = await messageService.getMessages(Number(pageSize), Number(pageNumber));
    res.send(ans);
    next();
}

export const getRepliesToSimilarMessages = async (req:Request, res: Response, next: NextFunction) => {
    const text = req.query.text as string; 
    const ans = await messageService.getRepliesToSimilarMessages(text);
    res.send(ans);
    next();
}

// export const postReplyByMessageId = async (req:Request, res: Response, next: NextFunction) => {
//     const [messageId, text] = req.params.body;
//     const ans = await messageService.addReply(messageId, text, username);
    
//     res.send(ans);
//     next();
// }

export const deleteIndices = async (req:Request, res: Response, next: NextFunction) => {
    const indices = req.query.index;
    const ans = await messageService.deleteIndices(indices as string[]);
    res.send(ans).status(200);
    next();
}