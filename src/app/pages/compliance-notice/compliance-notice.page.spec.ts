import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComplianceNoticePage } from './compliance-notice.page';

describe('ComplianceNoticePage', () => {
  let component: ComplianceNoticePage;
  let fixture: ComponentFixture<ComplianceNoticePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceNoticePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
