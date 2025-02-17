import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InitiatePostRegistrationPage } from './initiate-post-registration.page';

describe('InitiatePostRegistrationPage', () => {
  let component: InitiatePostRegistrationPage;
  let fixture: ComponentFixture<InitiatePostRegistrationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiatePostRegistrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
