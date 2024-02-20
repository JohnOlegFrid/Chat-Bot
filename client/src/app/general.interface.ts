export interface Question {
    text: string,
    createdAt: Date,
    answers: number
}

export interface QuestionFromServer extends Question {
    id: string
}

export interface Answer {
    questionId: string,
    text: string,
    createdAt: Date,
}