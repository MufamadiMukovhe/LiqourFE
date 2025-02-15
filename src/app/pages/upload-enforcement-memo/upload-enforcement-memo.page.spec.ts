import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadEnforcementMemoPage } from './upload-enforcement-memo.page';

describe('UploadEnforcementMemoPage', () => {
  let component: UploadEnforcementMemoPage;
  let fixture: ComponentFixture<UploadEnforcementMemoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadEnforcementMemoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
