import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThankYou3Page } from './thank-you3.page';

describe('ThankYou3Page', () => {
  let component: ThankYou3Page;
  let fixture: ComponentFixture<ThankYou3Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankYou3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
