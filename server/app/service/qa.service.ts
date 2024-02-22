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

export async function getAnswersToSimilarQuestions(text:string){
    const similarQuestions = await qaModel.findSimilarQuestions(text);
    if (!similarQuestions.length) return null;
    let answers = await qaModel.getAnswersForQuestion(similarQuestions[0].id!);
    return answers;
}

export async function deleteIndices(indeces: string[]){
    return qaModel.deleteIndices(indeces);
}