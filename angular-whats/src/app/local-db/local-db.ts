import Dexie, { IndexableType, PromiseExtended } from "dexie";
import { LocalUserImage } from "./local-user-image.model";
import { from } from "rxjs";

export class LocalDb {
  private localDb = new Dexie('whats-local');

  private get userTable(){
    return this.localDb.table<LocalUserImage>('users');
  }


  constructor() {
    this.localDb.version(1)
      .stores({
        users: '&id, name, imageBlob'
      });
  }

  addUsers(users: LocalUserImage[]){
    //this.userTable.bulkAdd(users); //Adicionar vários usuários
    return from(this.userTable.bulkPut(users));
  }

}
function form(arg0: PromiseExtended<IndexableType>) {
  throw new Error("Function not implemented.");
}

