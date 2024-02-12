import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "./user.model";
import { Observable, catchError, forkJoin, map, of, pipe, switchMap, tap } from "rxjs";
import { environment } from "@@environment/environment";
import { LocalDb } from "../local-db/local-db";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /* private http = inject(HttpClient);

  Usada em instruções para teste unitários.
  Função de nível superior do Angular que permite a injeção de dependência de um serviço em um componente.
  Não é recomendada para componentes de serviço.


  */
  private urlApi = `${environment.urlApi}`

  constructor(private http: HttpClient){

  }

  getUsers() {
    return this.http.get<User[]>(`${this.urlApi}/User`)
      .pipe(
        //SwitchMap é usado para fazer requisições paralelas
        //Após executar um observable ele vai executar outro observable
        //Todo operador do rxjs se usado no pipe recebe como argumento o resultado do operador anterior
        switchMap(users => {

          /*Nesse bloco é montado as requisições*/
          const userImageRequest =  users
            .map(user => this.getUserImage(user.id)
            //pipe vem de pipeline após uma função ele executa outra
            //pipe é usado para encadear operadores de observables
             .pipe(
              //Se der erro vai retornar null para o front
                catchError(_ => of(null)),
                map(image => ({
                  image, user
                }))));

          //Requisições paralelas
          //SwitchMap obriga a retornar um observable
          //forkJoin executa um array de observables
          return forkJoin(userImageRequest); // Funciona de um jeito parecido com o Promise.all
        }),
        // Interceptar um resultado -> tap(console.log)
        tap(userImages => {
          new LocalDb()
          .addUsers(userImages.map(u => {
            return {
              id: u.user.id,
              name: u.user.name,
              imageBlob: u.image
            }
          }));
        }),
        map(userImages =>
          userImages
          .map(userImageBlob => {
            return {
              user: userImageBlob.user,
              imageUrl: userImageBlob.image &&
                URL.createObjectURL(userImageBlob.image)
            }
          })

          )
      );
  }

/**
 * switchMap(users => {

          const userImageRequest = users
          .map(user => this.getUserImage(user.id)
            .pipe(map(image => {
              user, image
            }))));
        })
 * /

    //Espera o primeiro observable terminar para executar o segundo
  }

  /*
    Diferença de uma Promise para um Observable:
    Promises: tem um tempo de vida,
      executa uma vez e morre.
    Observable: tem a condição de ser
     executado várias vezes.

  */

     uploadUserImage(userId: string, image: ArrayBuffer){
      const blobImage = new Blob([image]);
      const formData = new FormData();
      //o nome precisa ser file, por causa do .net
      formData.append('file', blobImage);

      return this.http.put(`${this.urlApi}/user/${userId}/image`, formData);
     }

    private getUserImage(userId: string){
      return this.http.get(`${this.urlApi}/user/${userId}/image`, { responseType: 'blob' });
    }

}
