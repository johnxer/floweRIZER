export type MessageRole = 'ai' | 'user'

export interface Message {
    id: string;
    createdAt: string | number;
    message: string;
    role: MessageRole;
    user: string;
}