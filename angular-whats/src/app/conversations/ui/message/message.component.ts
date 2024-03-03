import { Component, Input } from '@angular/core';
import { LocalConversationMessage } from '../../../local-db/local-conversation-message-model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input({ required: true})
  message!: LocalConversationMessage;
  
}
