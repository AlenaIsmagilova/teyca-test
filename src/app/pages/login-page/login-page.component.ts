import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

export interface ILoginForm {
  login: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  constructor(private authService: AuthService, private router: Router) {}

  public readonly form = new FormGroup<ILoginForm>({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  public onSubmit() {
    const { login, password } = this.form.getRawValue();
    if (!login || !password) return;

    if (this.form.valid) {
      this.authService
        .login({ login, password })

        .subscribe({
          next: () => {
            this.router.navigate(['/clients']);
          },
        });
    }
  }
}
