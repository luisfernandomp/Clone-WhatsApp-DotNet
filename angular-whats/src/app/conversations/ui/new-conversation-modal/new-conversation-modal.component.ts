import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { UserService } from '../../../users/user.service';
import { AsyncPipe } from '@angular/common';
import { map, take } from 'rxjs';
import { User } from '../../../users/user.model';
import { ConversationService } from '../../conversation.service';

@Component({
  selector: 'app-new-conversation-modal',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './new-conversation-modal.component.html',
  styleUrl: './new-conversation-modal.component.scss'
})
export class NewConversationModalComponent {
  protected userService = inject(UserService);
  protected conversationService = inject(ConversationService);
  private currentUser = this.userService.getUserInfoSignal();

  protected localUsers$ = this.userService.getLocalUsers()
  .pipe(map(
    users => users.filter(user => user.id !== this.currentUser()!.id )
  ));
  
  @Input()
  showModal = false;
  
  @Output()
  showModalChange = new EventEmitter<boolean>();

  createNewConversation(user: User){
    this.conversationService.createConversation(user.id, user.name)
    .pipe(take(1)) //após o primeiro valor que ele emitir ele já se desinscreve
    .subscribe({
      next: () => this.showModalChange.emit(false)
    });
  }
}
