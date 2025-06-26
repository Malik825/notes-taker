import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // adjust path
import { AuthModalComponent } from '../authmodal/auth-modal.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  imports: [AuthModalComponent],
})
export class WelcomeComponent {
  authMode: 'signin' | 'signup' = 'signup';
  showAuthModal = false;

  constructor(private auth: AuthService, private router: Router) {}

 onGetStarted() {
  const user = this.auth.currentUser();
  if (user) {
    this.router.navigate(['/notes']); // Go straight to dashboard
  } else {
    this.authMode = 'signup';         // Open signup modal
    this.showAuthModal = true;
  }
}


  onCloseAuthModal() {
    this.showAuthModal = false;
  }

  onAuthRequested(mode: 'signin' | 'signup') {
    this.authMode = mode;
    this.showAuthModal = true;
  }
}
