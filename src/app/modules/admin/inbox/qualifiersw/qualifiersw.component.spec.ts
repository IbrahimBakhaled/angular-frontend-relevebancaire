import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualifierswComponent } from './qualifiersw.component';

describe('QualifierswComponent', () => {
  let component: QualifierswComponent;
  let fixture: ComponentFixture<QualifierswComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualifierswComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualifierswComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
