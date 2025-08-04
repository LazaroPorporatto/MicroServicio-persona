import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarCliente } from './actualizar-cliente';

describe('ActualizarCliente', () => {
  let component: ActualizarCliente;
  let fixture: ComponentFixture<ActualizarCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
