import { Observable, catchError, of, take } from 'rxjs';
import { UserService } from './../../../user.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../user.model';
import { AsyncPipe, NgFor } from '@angular/common';

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
      ));

  @ViewChild('input', { static: true, read: ElementRef}) inputFile!: ElementRef;

  constructor(private userService: UserService) { }

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

    onImageButtonClicked(userId: string){
      this.lastUserClicked = userId;

      this.inputFile.nativeElement.click();
    }


}
