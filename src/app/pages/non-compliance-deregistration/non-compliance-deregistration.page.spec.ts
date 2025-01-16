import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NonComplianceDeregistrationPage } from './non-compliance-deregistration.page';

describe('NonComplianceDeregistrationPage', () => {
  let component: NonComplianceDeregistrationPage;
  let fixture: ComponentFixture<NonComplianceDeregistrationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NonComplianceDeregistrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
