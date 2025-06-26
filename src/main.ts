import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideAnimations(),
  provideToastr({
      positionClass: 'toast-top-right',
      toastClass: 'ngx-toastr crazy-toast',
      timeOut: 3000,
      closeButton: true,
      progressBar: true
    })

  ],
}).catch((err) => console.error(err));
