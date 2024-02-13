import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './users/user.service';

const appInitilizerProvider = (userService: UserService) => {
  return () => {
    userService.trySyncLocalStorage()
  }
}
 
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitilizerProvider,
      multi: true,
      deps: [ UserService ]
    }
  ]
};
