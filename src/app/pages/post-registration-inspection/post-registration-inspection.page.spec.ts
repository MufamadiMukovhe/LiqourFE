import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostRegistrationInspectionPage } from './post-registration-inspection.page';

describe('PostRegistrationInspectionPage', () => {
  let component: PostRegistrationInspectionPage;
  let fixture: ComponentFixture<PostRegistrationInspectionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PostRegistrationInspectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
