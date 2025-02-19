import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotpaidComponent } from './notpaid.component';

describe('NotpaidComponent', () => {
  let component: NotpaidComponent;
  let fixture: ComponentFixture<NotpaidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotpaidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotpaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
