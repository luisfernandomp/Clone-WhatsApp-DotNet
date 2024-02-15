import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-conversation-messages-header',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './conversation-messages-header.component.html',
  styleUrl: './conversation-messages-header.component.scss'
})
export class ConversationMessagesHeaderComponent {
  
  private activatedRoute = inject(ActivatedRoute)
  
  protected userId$ 
    = this.activatedRoute.paramMap  
    .pipe(
      map(params => params.get('userId'))
      //O próximo pipe pega o valor do anterior
    );


}
