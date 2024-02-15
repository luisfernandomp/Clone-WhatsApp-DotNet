import { Component, inject } from '@angular/core';
import { ConversationHeaderComponent } from '../conversation-header/conversation-header.component';
import { ConversationContactComponent } from '../conversation-contact/conversation-contact/conversation-contact.component';
import { ConversationService } from '../../conversation.service';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [ConversationHeaderComponent,
  ConversationContactComponent,
AsyncPipe],
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.scss'
})
export class ConversationListComponent {
  protected conversationService = inject(ConversationService);

  protected conversations$ = this.conversationService
  .listenConversation();

  private router = inject(Router);

  protected goToUser(userId: string) {
    this.router.navigate(['conversations', userId]);
  }
}
