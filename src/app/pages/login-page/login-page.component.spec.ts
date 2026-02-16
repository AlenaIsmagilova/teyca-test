import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../../auth/auth.service';

describe('LoginPageComponent', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  let component: LoginPageComponent;

  const authServiceMock = {
    login: jasmine.createSpy('login').and.returnValue(of({})),
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    authServiceMock.login.calls.reset();
    routerMock.navigate.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT call login when form is empty/invalid', () => {
    component.form.setValue({ login: '', password: '' });

    component.onSubmit();

    expect(authServiceMock.login).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should call login and navigate to /clients when form is valid', () => {
    component.form.setValue({ login: 'test', password: '123456' });

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      login: 'test',
      password: '123456',
    });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/clients']);
  });
});
