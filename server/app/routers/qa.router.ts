import express from 'express'
import * as qaController from '../controllers/qa.controller'
const qaRouter = express.Router();

qaRouter.get('/answers-to-similar-questions',qaController.getAnswersToSimilarQuestions);
qaRouter.get('/answers/:qId',qaController.getAnswersByQuestionId);
qaRouter.post('/answers/:qId',qaController.postAnswersByQuestionId);
qaRouter.get('/questions',qaController.getQuestions);
qaRouter.delete('/indices',qaController.deleteIndices);

export default qaRouter