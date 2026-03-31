import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRegistrationRequestsComponent } from './pending-registration-requests-component';

describe('PendingRegistrationRequestsComponent', () => {
  let component: PendingRegistrationRequestsComponent;
  let fixture: ComponentFixture<PendingRegistrationRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingRegistrationRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingRegistrationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
