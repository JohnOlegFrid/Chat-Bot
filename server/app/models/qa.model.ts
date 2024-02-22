import { Client } from '@elastic/elasticsearch';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';

export interface QuestionDocument {
    id?: string;
    text: string;
    createdAt: Date;
}

export interface AnswerDocument {
    questionId: string;
    text: string;
    createdAt?: Date;
}

const QuestionIndex = "questions"
const AnswersIndex = "answers"

class QaModel {

    private static instance: QaModel;
    private client: Client;

    private constructor() {
        this.client = new Client({
            node: process.env.ELASTIC_URL,
            auth: {
                    username: process.env.ELASTIC_USERNAME!,
                    password: process.env.ELASTIC_PASSWORD!
                },
            
            tls: {
                rejectUnauthorized: false
            }
        });
        this.createIndex(QuestionIndex).then();
        this.createIndex(AnswersIndex).then();
    }

    static getInstance(): QaModel {
        if (!QaModel.instance) {
            QaModel.instance = new QaModel();
        }
        return QaModel.instance;
    }

    async indexExists(indexName: string): Promise<boolean> {
        try {
            const exists = await this.client.indices.exists({ index: indexName });
            return exists;
        } catch (error) {
            console.error(`Error checking if index "${indexName}" exists:`, error);
            throw error;
        }
    }

    async createIndex(indexName = QuestionIndex): Promise<void> {
        try {
           
            const indexExists = await this.indexExists(indexName);
            if (!indexExists) {
                await this.client.indices.create({ index: indexName });
                console.log(`Index "${indexName}" created successfully.`);
            } else {
                console.log(`Index "${indexName}" already exists.`);
            }
        } catch (error) {
            console.error(`Error creating index "${indexName}":`, error);
            throw error;
        }
    }

    async addQuestion(text: string): Promise<any> {
        try {
            const document: QuestionDocument = {
                text,
                createdAt: new Date(),
            };

            const response = await this.client.index({ index: QuestionIndex, body: document });
            return Object.assign(document, {id:response._id});
        } catch (error) {
            throw error;
        }
    }

    async addAnswer(questionId:string, text:string): Promise<any> {
        try {
            const document: AnswerDocument = {
                questionId,
                text,
                createdAt: new Date(),
            };

            await this.client.index({ index: AnswersIndex, body: document });
            return document;
        } catch (error) {
            throw error;
        }
    }

    async getQuestions(pageNumber: number, pageSize: number): Promise<QuestionDocument[]> {
        try {
            const query = {
                index: QuestionIndex,
                size: pageSize,
                from: (pageNumber - 1) * pageSize,
                sort: [{ createdAt: { order: "desc" } }]
            };

            const ans:SearchResponse = await this.client.search(query);
            const messages: QuestionDocument[] = ans.hits.hits.map((hit: any) => Object.assign(hit._source, {id: hit._id}));
            return messages;
        } catch (error) {
            console.error(error);
            return [];
        }
    }


    async getAnswersForQuestion(questionId: string): Promise<AnswerDocument[]> {
        try {
            const query = {
                index: AnswersIndex,
                questionId,
                sort: [{ createdAt: { order: "desc"} }],
            };

            const ans:SearchResponse = await this.client.search(query);
            const answers: AnswerDocument[] = ans.hits.hits.map((hit: any) => hit._source);
            return answers;
        } catch (error) {
            console.error(error);
            return[];
        }
    }

    async findSimilarQuestions(text: string): Promise<QuestionDocument[]> {
        try {
            const query = {
                index: QuestionIndex,
                body: {
                    query: {
                        more_like_this: {
                            fields: ['text'],
                            like: text,
                            min_term_freq: 1,
                            min_doc_freq: 1
                        }
                    }
                }
            };

            const ans:SearchResponse = await this.client.search(query);
            const similarMessages: QuestionDocument[] = ans.hits.hits.map((hit: any) => hit._source);
            return similarMessages;
        } catch (error) {
            console.error(error)
            return [];
        }
    }

    async deleteIndices(indeces: string[]) {
        return this.client.indices.delete(
            {
                index: indeces
            }
        )
        .then(_ => true)
        .catch(error => {
            console.error(error);
            false
        })
    }
}

const qaModel = QaModel.getInstance();
export default qaModel;