import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../security/auth/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatButtonModule,
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [
        trigger('fadeInUp', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(5px)' }),
                animate(
                    '200ms ease-out',
                    style({ opacity: 1, transform: 'translateY(0)' }),
                ),
            ]),
        ]),
    ],
})
export class LoginComponent {
    loginForm: FormGroup;
    submitted = false;
    errorMessage = ''; // 👈 Für Fehleranzeige

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router,
    ) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    onSubmit() {
        this.submitted = true;
        if (this.loginForm.valid) {
            const { username, password } = this.loginForm.value;

            this.auth.login(username, password).subscribe({
                next: () => {
                    // ✅ Login erfolgreich
                    this.router.navigate(['/home']);
                },
                error: (err) => {
                    // ❌ Fehler beim Login
                    this.errorMessage =
                        '❌ Login fehlgeschlagen. Bitte überprüfe deine Daten.';
                    console.error('Login-Fehler:', err);
                },
            });
        }
    }

    get username() {
        return this.loginForm.get('username');
    }

    get password() {
        return this.loginForm.get('password');
    }
}
