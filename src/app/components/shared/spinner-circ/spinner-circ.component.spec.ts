import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerCircComponent } from './spinner-circ.component';

describe('SpinnerCircComponent', () => {
  let component: SpinnerCircComponent;
  let fixture: ComponentFixture<SpinnerCircComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpinnerCircComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerCircComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
