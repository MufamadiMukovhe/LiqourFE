import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeregisterPage } from './deregister.page';

describe('DeregisterPage', () => {
  let component: DeregisterPage;
  let fixture: ComponentFixture<DeregisterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DeregisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
