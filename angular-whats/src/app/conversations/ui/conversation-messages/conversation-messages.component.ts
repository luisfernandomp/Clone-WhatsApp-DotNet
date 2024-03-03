import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren, inject } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { FormsModule } from '@angular/forms';
import { ConversationService } from '../../conversation.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, filter, map, takeUntil } from 'rxjs';
import { LocalConversationMessage } from '../../../local-db/local-conversation-message-model';

@Component({
  selector: 'app-conversation-messages',
  standalone: true,
  imports: [ MessageComponent, FormsModule ],
  templateUrl: './conversation-messages.component.html',
  styleUrl: './conversation-messages.component.scss'
})
export class ConversationMessagesComponent implements OnDestroy, AfterViewInit {
  
  private conversatioService = inject(ConversationService);
  protected inputMessage = '';
  protected messages: LocalConversationMessage[] = [];

  private unsub$ = new Subject<boolean>();
  private conversationUserId = '';

  @ViewChildren(MessageComponent) messageComps!: 
    QueryList<MessageComponent>;
    @ViewChildren('scrollPanel') scrollPanel!: ElementRef;

  constructor(activatedRoute: ActivatedRoute){
    activatedRoute.paramMap
    .pipe(
      map(params => params.get('userId')),
      filter(userId => !!userId), //Transformando uma string em true se tiver valor
      takeUntil(this.unsub$) // Cancela a inscrição quando o observable é completado
    ).subscribe(userId => {
      this.conversationUserId = userId || "";
      this.messages = [];
    })
  }

  sendMessage(){

    if(!this.inputMessage)
      return;

    this.messages.push({
      time: new Date(),
      mine: true,
      message: this.inputMessage,
      conversationUserId: this.conversationUserId
    });

    this.conversatioService
      .publishMessage(this.conversationUserId,
        this.inputMessage);

    this.inputMessage = '';
  }

  ngOnDestroy(){
    this.unsub$.next(true);
    this.unsub$.complete();
  }

  ngAfterViewInit(): void {
    this.messageComps.changes
    .pipe(takeUntil(this.unsub$))
    .subscribe(() => {
      this.scrollToLast();
    })
  }

  scrollToLast(){
    try
    { 
      this.scrollPanel.nativeElement.scrollTop = 
        this.scrollPanel.nativeElement.scrolHeight;
    }
    catch(err){
      console.error(err);
    }

  }

}
