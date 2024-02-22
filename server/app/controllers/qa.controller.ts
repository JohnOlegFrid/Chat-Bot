import { Response, Request, NextFunction } from "express";
import * as qaService from '../service/qa.service';

export const getAnswersByQuestionId = async (req:Request, res: Response, next: NextFunction) => {
    const qid = req.params.qid;
    const ans = await qaService.getAnswersByQuestionId(qid);
    res.send(ans);
    next();
}


export const getQuestions = async (req:Request, res: Response, next: NextFunction) => {
    const [pageSize, pageNumber] = [req.query.pageSize,req.query.pageNumber]; 
    const ans = await qaService.getQuestions(Number(pageSize), Number(pageNumber));
    res.send(ans);
    next();
}

export const getAnswersToSimilarQuestions = async (req:Request, res: Response, next: NextFunction) => {
    const text = req.query.text as string; 
    const ans = await qaService.getAnswersToSimilarQuestions(text);
    res.send(ans);
    next();
}

export const postAnswersByQuestionId = async (req:Request, res: Response, next: NextFunction) => {
    const [qid, text] = req.params.body;
    const ans = await qaService.addAnswer(qid, text);
    
    res.send(ans);
    next();
}

export const deleteIndices = async (req:Request, res: Response, next: NextFunction) => {
    const indices = req.query.index;
    const ans = await qaService.deleteIndices(indices as string[]);
    res.send(ans).status(200);
    next();
}