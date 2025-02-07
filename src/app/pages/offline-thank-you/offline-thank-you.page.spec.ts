import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfflineThankYouPage } from './offline-thank-you.page';

describe('OfflineThankYouPage', () => {
  let component: OfflineThankYouPage;
  let fixture: ComponentFixture<OfflineThankYouPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineThankYouPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
