export interface LocalConversationMessage {
    id?: number;
    message: string;
    conversationUserId: string;
    mine: boolean;
    time: Date;
}