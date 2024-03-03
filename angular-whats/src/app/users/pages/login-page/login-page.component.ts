import { catchError, of, take } from 'rxjs';
import { UserService } from './../../user.service';
import { Component, ElementRef, OnInit, ViewChild, signal } from '@angular/core';
import { User } from '../../user.model';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {

  private lastUserClicked = '';
  protected users: User[] = [];

  protected users$ = this.userService.getUsers()
      .pipe(catchError(
        err => {
          console.log(err);
          return of([]); // retorna um observable vazio
        }
      ),
      take(1));

  @ViewChild('input', { static: true, read: ElementRef}) inputFile!: ElementRef;

  constructor(private userService: UserService,
    private router: Router) { }

  ngOnInit() {

  }

  refreshUsers() {
    this.users$ = this.userService.getUsers()
    .pipe(catchError(
      err => {
        console.log(err);
        return of([]); // retorna um observable vazio
      }
    ));
  }


  /*
    Com inject eu estou pedindo a mesma instância
    que o Angular injeta no componente.
    Singleton
  */

    onFileSelected(event: any){
      const selectedFiles = event.target?.files as FileList;

      if(selectedFiles.length === 0)
        return;

      const file = selectedFiles[0];
      //Blob Binary Large Object

      const reader = new FileReader();

      reader.readAsArrayBuffer(file);

      reader.onloadend = () => {
        const fileInBytes = reader.result as ArrayBuffer;
        this.userService.uploadUserImage(this.lastUserClicked, fileInBytes)
        .subscribe({
          next: () => this.refreshUsers()
        });
      }

    }

    onImageButtonClicked(event: Event, userId: string){
      event.stopPropagation();
      this.lastUserClicked = userId;
      this.inputFile.nativeElement.click();
    }

    login(user: User) {
      this.userService.login(user.id)
      .pipe(take(1))
      // Vai se desinscrever automaticamente,
      // pegando somente o primeiro valor
      .subscribe({
        next: (resp) => {
          this.userService.setCurrentUser({
            ...user,
            token: resp.token
          });

          this.router.navigate(['conversations']);
        }
      })
    }

    clear(){
      this.inputFile.nativeElement.value = null;
    }

}
