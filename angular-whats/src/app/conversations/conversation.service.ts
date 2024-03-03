import { Injectable } from "@angular/core";
import { LocalDb } from "../local-db/local-db";
import { forkJoin, map, switchMap } from "rxjs";
import { Conversation } from "./conversation.model";

@Injectable({
    providedIn: 'root'
})
export class ConversationService{
    private localDb = new LocalDb();

    createConversation(id: string, userName: string){
        return this.localDb
        .addConversation(id, userName);
    }

    listenConversation() {
        return this.localDb.getLiveConversations()
        .pipe(
            switchMap(conversations => {
                const userImageBlobs
                     = conversations.map(c => 
                        this.localDb.getUserImage(c.id)
                            .pipe(map(imageBlob => ({
                                id: c.id,
                                userId: c.id,
                                userName: c.userName,
                                userImageUrl: !!imageBlob ?
                                    URL.createObjectURL(imageBlob) : ""
                            }) as Conversation )));

                return forkJoin(userImageBlobs);
            })
            
        );
    }

    publishMessage(convesationUserId: string, message: string){
        this.localDb.saveMessage({
            time: new Date(),
            message: message,
            mine: true,
            conversationUserId: convesationUserId
        });
    }
}