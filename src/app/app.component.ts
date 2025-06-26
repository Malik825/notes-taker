import { Component, signal } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { AuthModalComponent } from './components/authmodal/auth-modal.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, AuthModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showAuthModal = signal(false);
  authMode = signal<'signin' | 'signup'>('signin');

  openAuthModal(mode: 'signin' | 'signup') {
    this.authMode.set(mode);
    this.showAuthModal.set(true);
  }
}
