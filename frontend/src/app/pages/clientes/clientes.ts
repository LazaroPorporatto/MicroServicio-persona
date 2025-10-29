import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule], 
  providers: [DatePipe],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  public clientes: any[] = [];
  public isLoading: boolean = true;
  public error: string | null = null;

  // Variables de paginación
  public currentPage: number = 1; // página actual (para saber en qué página estamos.)
  public itemsPerPage: number = 3; // elementos por página (para definir el límite.)
  public totalItems: number = 0; // total de elementos ( para que el control de paginación sepa cuántas páginas crear.)
  
  // variables para la paginación manual
  public totalPages: number = 0;
  public pages: number[] = [];

  constructor(
    private router: Router,
    private apiService: ApiService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  async cargarClientes(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await this.apiService.getAllPersons(this.currentPage, this.itemsPerPage);
      this.clientes = response.content;
      this.totalItems = response.totalElements;

      // Calculamos el total de páginas
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      // Creamos un array de números de página para los botones [1, 2, 3, ...]
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    } catch (err: any) {
      this.handleApiError(err);
    } finally {
      this.isLoading = false;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.cargarClientes();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cargarClientes();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cargarClientes();
    }
  }

  async onEliminar(clienteId: number): Promise<void> {
    if (confirm('¿Estás seguro de que quieres eliminar a este cliente?')) {
      try {
        await this.apiService.deletePerson(clienteId);
        alert('Cliente eliminado con éxito.');
        // Si al eliminar nos quedamos sin clientes en la página actual, vamos a la anterior
        if (this.clientes.length === 1 && this.currentPage > 1) {
          this.currentPage--;
        }
        this.cargarClientes();
      } catch (err: any) {
        this.handleApiError(err);
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
  
  private handleApiError(err: any): void {
    if (err.response && err.response.status === 403) {
      this.error = 'No tienes permiso para esta acción.';
    } else {
      this.error = 'Ocurrió un error inesperado.';
    }
    console.error(err);
  }
}