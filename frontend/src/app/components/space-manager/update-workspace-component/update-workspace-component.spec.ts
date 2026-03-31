import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateWorkspaceComponent } from './update-workspace-component';

describe('UpdateWorkspaceComponent', () => {
  let component: UpdateWorkspaceComponent;
  let fixture: ComponentFixture<UpdateWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateWorkspaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
