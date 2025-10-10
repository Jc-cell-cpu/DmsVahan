import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CustomCardComponent } from '../../shared/components/custom-card/custom-card.component';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { CustomPasswordComponent } from '../../shared/components/custom-password/custom-password.component';
import { CustomSelectComponent } from '../../shared/components/custom-select/custom-select.component';
import type { SelectOption } from '../../shared/components/custom-select/custom-select.component';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { LoadingOverlayComponent } from '../../shared/components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomCardComponent,
    CustomInputComponent,
    CustomPasswordComponent,
    CustomSelectComponent,
    CustomButtonComponent,
    ToastComponent,
    LoadingOverlayComponent,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  captchaText: string = '';
  captchaHash: string = '';
  captchaImageUrl: string = '';
  randomFieldName1: string = '';
  randomFieldName2: string = '';
  isLoading: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  states: SelectOption[] = [
    { label: 'Select State', value: null },
    { label: 'Delhi', value: 'DL' },
    { label: 'Maharashtra', value: 'MH' },
    { label: 'Karnataka', value: 'KA' },
    { label: 'Tamil Nadu', value: 'TN' },
    { label: 'Gujarat', value: 'GJ' },
    { label: 'Rajasthan', value: 'RJ' },
    { label: 'West Bengal', value: 'WB' },
    { label: 'Uttar Pradesh', value: 'UP' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.randomFieldName1 =
      'field_' + Math.random().toString(36).substring(2, 15);
    this.randomFieldName2 =
      'field_' + Math.random().toString(36).substring(2, 15);

    this.loginForm = this.fb.group({
      userId: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      state: [null, Validators.required],
      captcha: ['', [Validators.required, this.captchaValidator.bind(this)]],
    });

    this.refreshCaptcha();

    // Delay to prevent Chrome autofill detection
    setTimeout(() => {
      this.disableAutofill();
    }, 100);
  }

  private disableAutofill(): void {
    const inputs = document.querySelectorAll(
      'input[type="text"], input[type="password"]'
    );
    inputs.forEach((input: any) => {
      input.setAttribute('autocomplete', 'nope');
      input.setAttribute('data-form-type', 'other');
    });
  }

  refreshCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.captchaText = result;
    this.captchaHash = this.generateHash(result);
    this.generateCaptchaImage(result);
  }

  private generateCaptchaImage(text: string): void {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    canvas.width = 140;
    canvas.height = 50;

    // Background with noise
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise dots
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      }, 0.3)`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2,
        2
      );
    }

    // Add noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      }, 0.4)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw text with distortion
    ctx.font = 'bold 20px Times New Roman';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const x = 20 + i * 20 + (Math.random() - 0.5) * 10;
      const y = 25 + (Math.random() - 0.5) * 8;
      const rotation = (Math.random() - 0.5) * 0.4;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${
        Math.random() * 100
      }, 0.8)`;
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }

    this.captchaImageUrl = canvas.toDataURL('image/png');
  }

  private generateHash(text: string): string {
    // Simple hash function for demo (in real app, use server-side)
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const inputHash = this.generateHash(
      this.loginForm.value.captcha.toUpperCase()
    );
    if (inputHash !== this.captchaHash) {
      this.loginForm.get('captcha')?.setErrors({ incorrect: true });
      this.loginForm.get('captcha')?.markAsTouched();
      return;
    }

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.showToast = true;
      this.toastMessage = 'Login successful! Redirecting to dashboard...';
      this.toastType = 'success';

      setTimeout(() => {
        console.log('Login successful!', {
          userId: this.loginForm.value.userId,
          state: this.loginForm.value.state,
        });
        window.location.href = '/document-config';
      }, 2000);
    }, 2000);
  }

  onReset() {
    this.loginForm.reset();
    this.loginForm.markAsUntouched();
    this.loginForm.markAsPristine();
    this.refreshCaptcha();
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach((key) => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  private captchaValidator(control: any) {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    const inputHash = this.generateHash(control.value.toUpperCase());
    if (inputHash !== this.captchaHash) {
      return { incorrect: true };
    }

    return null;
  }

  onToastClose(): void {
    this.showToast = false;
  }
}
