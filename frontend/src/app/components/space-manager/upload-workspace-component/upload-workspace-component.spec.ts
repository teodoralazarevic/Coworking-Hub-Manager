import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadWorkspaceComponent } from './upload-workspace-component';

describe('UploadWorkspaceComponent', () => {
  let component: UploadWorkspaceComponent;
  let fixture: ComponentFixture<UploadWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadWorkspaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
