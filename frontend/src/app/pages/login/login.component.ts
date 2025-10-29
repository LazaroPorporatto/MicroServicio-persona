import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  email: string = '';
  password: string = '';
  error: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/clientes']);
    }
  }

  async onSubmit(): Promise<void> {
    this.error = null;
    const credentials = {
      email: this.email,
      password: this.password
    };

    try {
      const response = await this.apiService.login(credentials);

      // Buscamos la propiedad 'accessToken' que envía nuestro backend.
      const token = response.accessToken; 

      if (token) {
        this.authService.saveTokenAndDecode(token);
        alert('¡Inicio de sesión exitoso!');
        this.router.navigate(['/clientes']);
      } else {
        this.error = 'Login correcto, pero el servidor no devolvió un token.';
        alert(this.error);
      }
    } catch (err: any) {
      console.error('Error detallado:', err);
      if (err.response && err.response.data) {
        this.error = err.response.data.message || 'Credenciales incorrectas.';
      } else {
        this.error = 'No se pudo conectar con el servidor.';
      }
      alert(`Falló el inicio de sesión: ${this.error}`);
    }
  }

  goToCrearPersona(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/crear-persona']);
  }
}