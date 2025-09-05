import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomCardComponent } from '../../shared/components/custom-card/custom-card.component';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { CustomPasswordComponent } from '../../shared/components/custom-password/custom-password.component';
import { CustomSelectComponent } from '../../shared/components/custom-select/custom-select.component';
import type { SelectOption } from '../../shared/components/custom-select/custom-select.component';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';

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
    CustomButtonComponent
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  captchaText: string = '';
  randomFieldName1: string = '';
  randomFieldName2: string = '';
  isLoading: boolean = false;
  showSuccess: boolean = false;

  states: SelectOption[] = [
    { label: 'Select State', value: null },
    { label: 'Delhi', value: 'DL' },
    { label: 'Maharashtra', value: 'MH' },
    { label: 'Karnataka', value: 'KA' },
    { label: 'Tamil Nadu', value: 'TN' },
    { label: 'Gujarat', value: 'GJ' },
    { label: 'Rajasthan', value: 'RJ' },
    { label: 'West Bengal', value: 'WB' },
    { label: 'Uttar Pradesh', value: 'UP' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.randomFieldName1 = 'field_' + Math.random().toString(36).substring(2, 15);
    this.randomFieldName2 = 'field_' + Math.random().toString(36).substring(2, 15);
    
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      state: [null, Validators.required],
      captcha: ['', [Validators.required, this.captchaValidator.bind(this)]]
    });

    this.refreshCaptcha();
    
    // Delay to prevent Chrome autofill detection
    setTimeout(() => {
      this.disableAutofill();
    }, 100);
  }

  private disableAutofill(): void {
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    inputs.forEach((input: any) => {
      input.setAttribute('autocomplete', 'nope');
      input.setAttribute('data-form-type', 'other');
    });
  }

  refreshCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like I, O, 0, 1
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.captchaText = result;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
    
    if (this.loginForm.value.captcha.toUpperCase() !== this.captchaText) {
      this.loginForm.get('captcha')?.setErrors({ 'incorrect': true });
      this.loginForm.get('captcha')?.markAsTouched();
      return;
    }
    
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.showSuccess = true;
      
      setTimeout(() => {
        console.log('Login successful!', {
          userId: this.loginForm.value.userId,
          state: this.loginForm.value.state
        });
        // Navigate to dashboard
      }, 1500);
    }, 2000);
  }

  onReset() {
    this.loginForm.reset();
    this.loginForm.markAsUntouched();
    this.loginForm.markAsPristine();
    this.refreshCaptcha();
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  private captchaValidator(control: any) {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }
    
    if (control.value.toUpperCase() !== this.captchaText) {
      return { 'incorrect': true };
    }
    
    return null;
  }
}