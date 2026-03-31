import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPublicComponent } from './login-public-component';

describe('LoginPublicComponent', () => {
  let component: LoginPublicComponent;
  let fixture: ComponentFixture<LoginPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPublicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
