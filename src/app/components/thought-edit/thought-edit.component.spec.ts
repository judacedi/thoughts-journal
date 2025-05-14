import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtEditComponent } from './thought-edit.component';

describe('ThoughtEditComponent', () => {
  let component: ThoughtEditComponent;
  let fixture: ComponentFixture<ThoughtEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThoughtEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThoughtEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
