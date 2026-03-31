import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingWorkspacesRequestsComponent } from './pending-workspaces-requests-component';

describe('PendingWorkspacesRequestsComponent', () => {
  let component: PendingWorkspacesRequestsComponent;
  let fixture: ComponentFixture<PendingWorkspacesRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingWorkspacesRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingWorkspacesRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
