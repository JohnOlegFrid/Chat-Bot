import qaModel from '../models/qa.model';

export async function getAnswersByQuestionId (qid: string) {
    const ans = await qaModel.getAnswersForQuestion(qid);
    return ans;
}

export async function getQuestions (pageSize:number, pageNumber:number) {
    const ans = await qaModel.getQuestions(pageNumber,pageSize);
    return ans;
}

export async function addAnswer(qid: string, text:string) {
    const ans = await qaModel.addAnswer(qid, text);
    return ans;
}