import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesComponent } from './clientes';

describe('ClientesComponent', () => { // Es buena práctica nombrar el describe igual que el componente
  let component: ClientesComponent;
  let fixture: ComponentFixture<ClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // importamos el COMPONENTE directamente, porque es standalone.
      imports: [ClientesComponent] 
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});