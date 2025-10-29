import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, CreatePersonData } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-persona',
  standalone: true, // Un componente Standalone es un componente autosuficiente. Él mismo declara las "piezas" que necesita para funcionar.
  imports: [ReactiveFormsModule, CommonModule], // Las dependencias del componente
  templateUrl: './crear-persona.html',
  styleUrls: ['./crear-persona.css'],
})
export class CrearPersonaComponent {

  formulario = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    dni: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    fechaNacimiento: new FormControl(''),
    ciudadId: new FormControl<number | null>(null, [Validators.required]),
  });

  constructor(private apiService: ApiService, private router: Router) {}

  async onSubmitCrearPersona(): Promise<void> {
    if (this.formulario.invalid) {
      alert('Por favor, completa todos los campos requeridos correctamente.');
      this.formulario.markAllAsTouched();
      return;
    }

    const formValue = this.formulario.getRawValue();
    const birthDateValue = formValue.fechaNacimiento ? formValue.fechaNacimiento : undefined;

    const datosParaBackend: CreatePersonData = {
      firstName: formValue.nombre || '',
      lastName: formValue.apellido || '',
      dni: formValue.dni || '',
      password: formValue.password || '',
      email: formValue.email || '',
      cityId: formValue.ciudadId || 0,
      birthDate: birthDateValue,
    };

    console.log("Datos de registro a enviar al backend:", datosParaBackend);

    try {
      await this.apiService.register(datosParaBackend);
      alert('¡Registro exitoso! Ya puedes iniciar sesión con tu email y contraseña.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        alert('Error: El correo electrónico o el DNI ya están registrados.');
      } else {
        alert('Error al crear el usuario. Revisa la consola (F12) para más detalles.');
      }
      console.error('Error en el registro:', error);
    }
  }
}