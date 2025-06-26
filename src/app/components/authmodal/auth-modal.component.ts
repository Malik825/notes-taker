import { Component, Input, Output, EventEmitter, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() mode: 'signin' | 'signup' | 'reset' = 'signin';
  @Output() visibleChange = new EventEmitter<boolean>();

  signinForm: FormGroup;
  signupForm: FormGroup;
  resetForm: FormGroup;

  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });

    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible']?.currentValue) {
      this.error.set(null);
      this.signinForm.reset();
      this.signupForm.reset();
      this.resetForm.reset();
    }
  }

  switchMode(mode: 'signin' | 'signup' | 'reset') {
    this.mode = mode;
    this.error.set(null);
  }

  signIn() {
    if (this.signinForm.invalid) return;

    const { email, password } = this.signinForm.value;
    const success = this.auth.login(email, password);
    if (success) {
      this.router.navigate(['/notes']); // ✅ redirect
      this.visibleChange.emit(false);
    } else {
      this.error.set('Invalid email or password');
    }
  }

  signUp() {
    if (this.signupForm.invalid) return;

    const { name, email, password, confirmPassword } = this.signupForm.value;
    if (password !== confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }

    const success = this.auth.register(name, email, password);
    if (success) {
      this.router.navigate(['/notes']); // ✅ redirect
      this.visibleChange.emit(false);
    } else {
      this.error.set('User already exists');
    }
  }

  reset() {
    if (this.resetForm.invalid) return;

    const { email } = this.resetForm.value;
    const exists = this.auth.resetPassword(email);
    this.error.set(null);
    this.visibleChange.emit(false);

  }

  close() {
    this.visibleChange.emit(false);
  }
  ngOnInit() {
  window.addEventListener('keydown', this.handleEscape);
}

ngOnDestroy() {
  window.removeEventListener('keydown', this.handleEscape);
}

handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') this.close();
};

}
