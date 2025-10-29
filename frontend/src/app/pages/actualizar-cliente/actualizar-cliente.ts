import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Importamos el servicio y la interfaz de actualización de persona
import { ApiService, UpdatePersonData } from '../../services/api.service';

@Component({
  selector: 'app-actualizar-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-cliente.component.html',
  styleUrl: './actualizar-cliente.component.css'
})
export class ActualizarClienteComponent implements OnInit {
  
  public clienteId: number | null = null;
  public isLoading: boolean = true;
  
  // Objeto para los datos del formulario
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    dni: '',
    birthDate: '',
    cityId: null as number | null
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService // Inyectamos el servicio
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.clienteId = +idParam;
      this.cargarDatosDelCliente();
    } else {
      console.error('No se encontró un ID en la URL.');
      this.router.navigate(['/clientes']);
    }
  }

  // Método para cargar los datos del cliente en el formulario
  async cargarDatosDelCliente(): Promise<void> {
    if (!this.clienteId) return;
    this.isLoading = true;
    try {
      const cliente = await this.apiService.getPersonById(this.clienteId);
      
      this.formData.firstName = cliente.firstName;
      this.formData.lastName = cliente.lastName;
      this.formData.email = cliente.email;
      this.formData.dni = cliente.dni;
      this.formData.cityId = cliente.city?.id;
      // Formateamos la fecha a YYYY-MM-DD para el input type="date" - para evitar errores de UTC
      this.formData.birthDate = cliente.birthDate ? new Date(cliente.birthDate).toISOString().split('T')[0] : '';

    } catch (error) {
      console.error('Error al cargar datos del cliente:', error);
      alert('No se pudo cargar la información del cliente.');
    } finally {
      this.isLoading = false;
    }
  }

  // Método que se ejecuta al hacer clic en "ACTUALIZAR" 
  async onSubmit(): Promise<void> {
    if (!this.clienteId) return;

    // Armamos el objeto con los datos del formulario
    const datosParaActualizar: UpdatePersonData = {
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      email: this.formData.email,
      dni: this.formData.dni,
      cityId: Number(this.formData.cityId),
      birthDate: this.formData.birthDate
    };

    try {
      await this.apiService.updatePerson(this.clienteId, datosParaActualizar);
      alert('Cliente actualizado con éxito.');
      this.router.navigate(['/clientes']);
    } catch (error) {
      console.error('Error al actualizar el cliente:', error);
      alert('No se pudo actualizar la información.');
    }
  }
}