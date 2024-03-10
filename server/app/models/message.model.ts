import { Client } from '@elastic/elasticsearch';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';

export interface messageDocument {
    id?: string;
    text: string;
    senderName:string;
    createdAt: Date;
}

export interface ReplyDocument extends messageDocument {
    replyToMessageId: string;
}

const MessageIndex = "messages"
const AnswersIndex = "replies"

class MessageModel {

    private static instance: MessageModel;
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
        this.createIndex(MessageIndex).then();
        this.createIndex(AnswersIndex).then();
    }

    static getInstance(): MessageModel {
        if (!MessageModel.instance) {
            MessageModel.instance = new MessageModel();
        }
        return MessageModel.instance;
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

    async createIndex(indexName = MessageIndex): Promise<void> {
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

    async addMessage(text: string,username:string): Promise<any> {
        try {
            const document: messageDocument = {
                text,
                senderName: username,
                createdAt: new Date(),
            };

            const response = await this.client.index({ index: MessageIndex, body: document });
            return Object.assign(document, {id:response._id});
        } catch (error) {
            throw error;
        }
    }

    async addReply(replyToMessageId:string, text:string, username:string): Promise<any> {
        try {
            const document: ReplyDocument = {
                replyToMessageId,
                text,
                senderName: username,
                createdAt: new Date(),
            };

            await this.client.index({ index: AnswersIndex, body: document });
            return document;
        } catch (error) {
            throw error;
        }
    }

    async getMessages(pageNumber: number, pageSize: number): Promise<messageDocument[]> {
        try {
            const query = {
                index: MessageIndex,
                size: pageSize,
                from: (pageNumber - 1) * pageSize,
                sort: [{ createdAt: { order: "desc" } }]
            };

            const ans:SearchResponse = await this.client.search(query);
            const messages: messageDocument[] = ans.hits.hits.map((hit: any) => Object.assign(hit._source, {id: hit._id}));
            return messages;
        } catch (error) {
            console.error(error);
            return [];
        }
    }


    async getRepliesByMessageId(replyToMessageId: string): Promise<ReplyDocument[]> {
        try {
            const query = {
                index: AnswersIndex,
                replyToMessageId,
                sort: [{ createdAt: { order: "desc"} }],
            };

            const ans:SearchResponse = await this.client.search(query);
            const answers: ReplyDocument[] = ans.hits.hits.map((hit: any) => hit._source);
            return answers;
        } catch (error) {
            console.error(error);
            return[];
        }
    }

    async findSimilarMessages(text: string): Promise<messageDocument[]> {
        try {
            const query = {
                index: MessageIndex,
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
            const similarMessages: messageDocument[] = ans.hits.hits.map((hit: any) => hit._source);
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

const messageModel = MessageModel.getInstance();
export default messageModel;