import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfflinePasswordPage } from './offline-password.page';

describe('OfflinePasswordPage', () => {
  let component: OfflinePasswordPage;
  let fixture: ComponentFixture<OfflinePasswordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflinePasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
