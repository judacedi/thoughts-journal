import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtFormComponent } from './thought-form.component';

describe('ThoughtFormComponent', () => {
  let component: ThoughtFormComponent;
  let fixture: ComponentFixture<ThoughtFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThoughtFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThoughtFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
