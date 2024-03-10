import express from 'express'
import * as messageController from '../controllers/message.controller'
const messageRouter = express.Router();

messageRouter.get('/replies-to-similar-message',messageController.getRepliesToSimilarMessages);
messageRouter.get('/replies/:qId',messageController.getRepliesByMessageId);
// messageRouter.post('/replies/:qId',messageController.postReplyByMessageId);
messageRouter.get('/messages',messageController.getMessages);
messageRouter.delete('/indices',messageController.deleteIndices);

export default messageRouter