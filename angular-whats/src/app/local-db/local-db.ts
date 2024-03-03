import Dexie, { liveQuery } from "dexie";
import { LocalUserImage } from "./local-user-image.model";
import { defer, from, map, of } from "rxjs";
import { LocalConversation } from "./local-conversation.model";
import { LocalConversationMessage } from "./local-conversation-message-model";

/*
wrapper -> criar uma estrutura em volta de uma classe,

*/

export class LocalDb {
  private localDb = new Dexie('whats-local');

  private get userTable(){
    return this.localDb.table<LocalUserImage>('users');
  }

  private get conversationTable(){
    return this.localDb.table<LocalConversation>('conversations');
  }
  
  private get conversationMessageTable()
  {
    return this.localDb.table<LocalConversationMessage>('conversationMessages'); 
  }

  constructor() {
    //Ao atualizar o version o banco de dados é recriado novamente
    //& -> id único para a tabela
    // para que o Dexie crie uma coluna autoincrementável basta passar o símbolo + antes do nome da coluna
    this.localDb.version(2)
      .stores({
        users: '&id, name, imageBlob',
        conversations: '&id, userName',
        conversationMessage: '++id, conversationUserId, message, mine, time'
      });
  }

  addUsers(users: LocalUserImage[]){
    //this.userTable.bulkAdd(users); //Adicionar vários usuários
    return from(this.userTable.bulkPut(users));
  }

  addConversation(id: string, userName: string){
    return defer(() => this.conversationTable.put({id, userName}));
  }

  getUserImage(userId: string){
    //from -> executado imediatamente sem subscribe
    //defer -> executado quando alguém se inscrever

   return from(this.userTable.get(userId))
    .pipe(map(localUserImage => localUserImage!.imageBlob));   
  }

  getUsers() {
    //O observable retornado pelo of é executado diretamente não precisa se inscrever nele
    return defer(() => this.userTable.toArray());
  }

  getLiveConversations(){
    return from(liveQuery(() => this.conversationTable.toArray()));
  }

  getUserById(userId: string){
    return defer(() => 
    this.userTable.get(userId.toLowerCase()));
  }

  saveMessage(message: LocalConversationMessage){
    return from(this.conversationMessageTable.add(message)); 
    //From -> não precisa de subscribe 
  }

  getMessagesHistoryByCoversationUserId(conversationUserId: string){
    return defer(() =>
            this.conversationMessageTable
            .where('conversationUserId')
            .equalsIgnoreCase(conversationUserId)
            .toArray());
  }
}