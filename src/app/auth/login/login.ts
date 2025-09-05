import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Card,
    InputText,
    Password,
    Select,
    Button,
    Tooltip
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  captchaText: string = '';

  states = [
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
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      state: [null, Validators.required],
      captcha: ['', [Validators.required, this.captchaValidator.bind(this)]]
    });

    this.refreshCaptcha();
  }

  refreshCaptcha() {
    this.captchaText = Math.random().toString(36).substring(2, 7).toUpperCase();
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
    
    // Simulate login process
    console.log('Login successful!', {
      userId: this.loginForm.value.userId,
      state: this.loginForm.value.state
    });
    
    // Here you would typically call an authentication service
    // this.authService.login(this.loginForm.value).subscribe(...);
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