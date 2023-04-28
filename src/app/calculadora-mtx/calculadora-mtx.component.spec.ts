import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculadoraMtxComponent } from './calculadora-mtx.component';

describe('CalculadoraMtxComponent', () => {
  let component: CalculadoraMtxComponent;
  let fixture: ComponentFixture<CalculadoraMtxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculadoraMtxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculadoraMtxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
