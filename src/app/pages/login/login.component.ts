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
})
export class LoginComponent {
    /** Reactive form group for login */
    loginForm: FormGroup;
    submitted = false;
    errorMessage = '';

    /**
     * @param fb FormBuilder for creating the reactive form
     * @param router Angular Router to navigate on success
     * @param authService Service to authenticate user
     */
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService,
    ) {
        // Initialize login form with validation
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    /**
     * Handles form submission and triggers authentication
     */
    onSubmit() {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }

        const { username, password } = this.loginForm.value;

        this.authService.login(username, password).subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.errorMessage =
                    'Login fehlgeschlagen. Bitte überprüfe deine Eingaben.';
                console.error(err);
            },
        });
    }

    /**
     * Getter for the username form control
     */
    get username() {
        return this.loginForm.get('username');
    }

    /**
     * Getter for the password form control
     */
    get password() {
        return this.loginForm.get('password');
    }
}
