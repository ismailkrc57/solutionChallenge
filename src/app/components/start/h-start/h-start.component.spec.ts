import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HStartComponent } from './h-start.component';

describe('HStartComponent', () => {
  let component: HStartComponent;
  let fixture: ComponentFixture<HStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HStartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
