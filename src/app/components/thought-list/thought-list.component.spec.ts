import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtListComponent } from './thought-list.component';

describe('ThoughtListComponent', () => {
  let component: ThoughtListComponent;
  let fixture: ComponentFixture<ThoughtListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThoughtListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThoughtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
