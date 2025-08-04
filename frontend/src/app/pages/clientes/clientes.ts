// RUTA: src/app/pages/clientes/clientes.ts
// --- CÓDIGO FINAL LISTO PARA COPIAR Y PEGAR ---

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  public clientes: any[] = [];
  public isLoading: boolean = true;
  public error: string | null = null;

  constructor(
    private router: Router,
    private apiService: ApiService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cargarClientes();
  }

  async cargarClientes(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      this.clientes = await this.apiService.getAllPersons();
      console.log('Datos reales cargados desde el backend:', this.clientes);
    } catch (err: any) { // <-- CAMBIO: Tipamos el error como 'any' para acceder a 'response'
      // --- CAMBIO: Manejo de errores más detallado ---
      if (err.response && err.response.status === 403) {
        this.error = 'No tienes permiso para ver esta lista. Contacta al administrador.';
      } else {
        this.error = 'No se pudieron cargar los clientes. ¿El token es válido o ha expirado?';
      }
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  async onEliminar(clienteId: number): Promise<void> {
    if (confirm('¿Estás seguro de que quieres eliminar a este cliente?')) {
      try {
        await this.apiService.deletePerson(clienteId);
        alert('Cliente eliminado con éxito.');
        this.cargarClientes(); // Recargamos la lista
      } catch (err: any) {
        if (err.response && err.response.status === 403) {
          alert('Error: No tienes permiso para eliminar clientes.');
        } else {
          alert('Error: No se pudo eliminar el cliente.');
        }
      }
    }
  }

  onEditar(clienteId: number): void {
    this.router.navigate(['/actualizar-cliente', clienteId]);
  }

  onSalir(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}