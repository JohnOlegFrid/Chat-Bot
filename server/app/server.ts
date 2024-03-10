
import app from './app'
const port = process.env.PORT
import { Server as SocketIOServer } from 'socket.io';
import messageModel, { messageDocument, ReplyDocument } from './models/message.model'
import messageRouter from './routers/message.router';
const server = app.listen(port)
console.log("Server listening on port:", port);

const NewMessageChanel = 'addMessage'
const NewReplyChanel = 'addReplyToMessage'
const NewMessagePublished = 'newMessagePublished'
const NewReplyPublished = 'newReplyPublished'

const io = new SocketIOServer(server, {
    cors: {
        origin: '*',
    }
});

app.use(messageRouter);

io.on('connection', (socket) => {
    console.log('A user connected');
    const senderName = socket.handshake.auth.username
    console.log(senderName);
    socket.on(NewMessageChanel, async (text: string) => {
        try {
            const newmessage = await messageModel.addMessage(text, senderName);
            io.sockets.emit(NewMessagePublished, newmessage);
        } catch(e){ 
            console.error(e);
        }
        
    });

    socket.on(NewReplyChanel, async (messageId:string, text:string ) => {
        
        try {
            const newAnswer = await messageModel.addReply(messageId, text, senderName);
            io.sockets.emit(NewReplyPublished, newAnswer);
        } catch(e){ 
            console.error(e);
        }
        
    });

    socket.on('getMessages', async (page: number, pageSize: number) => {
        try {
            const messages = await messageModel.getMessages(page, pageSize);
            socket.emit("postMessages", messages);
        } catch(e){ 
            console.error(e);
        }
        
    });

    socket.on('getRepliesByMessageId', async (messageId: string) => {
        try {
            const replies = await messageModel.getRepliesByMessageId(messageId);
            socket.emit("postMessages", replies);
        } catch(e){ 
            console.error(e);
        }
        
    });

    
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

