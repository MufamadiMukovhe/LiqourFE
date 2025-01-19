import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SapsAttachPage } from './saps-attach.page';

describe('SapsAttachPage', () => {
  let component: SapsAttachPage;
  let fixture: ComponentFixture<SapsAttachPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SapsAttachPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
