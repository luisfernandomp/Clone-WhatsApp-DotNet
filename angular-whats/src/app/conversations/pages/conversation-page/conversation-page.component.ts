import { Component, inject } from '@angular/core';
import { UserService } from '../../../users/user.service';
import { ConversationListComponent } from '../../ui/conversation-list/conversation-list.component';
import { RouterOutlet } from '@angular/router';

@Component({
  //Página não precisa de seletor
  //selector: 'app-conversation-page',
  standalone: true,
  imports: [ConversationListComponent, RouterOutlet],
  templateUrl: './conversation-page.component.html',
  styleUrl: './conversation-page.component.scss'
})
export default class ConversationPageComponent {
  protected userService = inject(UserService);
  protected userInfo = this.userService.getUserInfoSignal();


  logout(){
    this.userService.logout();
  }


}
