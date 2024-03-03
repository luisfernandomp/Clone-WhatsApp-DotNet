import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { UserService } from '../../../users/user.service';

@Component({
  selector: 'app-conversation-messages-header',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './conversation-messages-header.component.html',
  styleUrl: './conversation-messages-header.component.scss'
})
export class ConversationMessagesHeaderComponent {
  
  private activatedRoute = inject(ActivatedRoute)
  private userService = inject(UserService);
  
  protected user$ 
    = this.activatedRoute.paramMap  
    .pipe(
      map(params => params.get('userId')),
      switchMap(userId => 
        this.userService.getLocalUserById(userId!)));
}
