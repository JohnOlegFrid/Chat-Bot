
import app from '.'
const port = process.env.PORT
import { Server as SocketIOServer } from 'socket.io';
import qaModel, { QuestionDocument, AnswerDocument } from './models/qa.model'
import qaRouter from './routers/qa.router';
const server = app.listen(port)
console.log("Server listening on port:", port);


const io = new SocketIOServer(server, {
    cors: {
        origin: '*',
    }
});

app.use(qaRouter);

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('addQuestion', async (text: string) => {
        try {
            const newQuestion = await qaModel.addQuestion(text);
            io.sockets.emit("newQuestionPublished", newQuestion);
        } catch(e){ 
            console.error(e);
        }
        
    });

    socket.on('addAnswer', async (questionId:string, text:string ) => {
        
        try {
            const newAnswer = await qaModel.addAnswer(questionId, text);
            io.sockets.emit("newAnswerPublished", newAnswer);
        } catch(e){ 
            console.error(e);
        }
        
    });

    socket.on('getQuestions', async (page: number, pageSize: number) => {
        try {
            const questions = await qaModel.getQuestions(page, pageSize);
            socket.emit("getQuestions", questions);
        } catch(e){ 
            console.error(e);
        }
        
    });

    socket.on('getAnswersForQuestionId', async (questionId: string) => {
        try {
            const answers = await qaModel.getAnswersForQuestion(questionId);
            socket.emit("getQuestions", answers);
        } catch(e){ 
            console.error(e);
        }
        
    });

    
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

