import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PremisesDescriptionPage } from './premises-description.page';

describe('PremisesDescriptionPage', () => {
  let component: PremisesDescriptionPage;
  let fixture: ComponentFixture<PremisesDescriptionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PremisesDescriptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
