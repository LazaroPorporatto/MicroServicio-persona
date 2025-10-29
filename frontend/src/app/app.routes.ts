import { Routes } from '@angular/router';
import { TemplateComponent } from './pages/template/template.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { CrearPersonaComponent } from './pages/crear-persona/crear-persona';
import { ClientesComponent } from './pages/clientes/clientes';
import { ActualizarClienteComponent } from './pages/actualizar-cliente/actualizar-cliente'; // <-- NUEVA IMPORTACIÓN

export const routes: Routes = [
  // Ruta para el Login
  { path: 'login', component: LoginComponent },

  // Ruta por defecto para el inicio de la aplicación, redirigiendo a 'login'
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Ruta para Crear Persona
  { path: 'crear-persona', component: CrearPersonaComponent },

  // NUEVA RUTA para Clientes
  { path: 'clientes', component: ClientesComponent },

  // NUEVA RUTA para Actualizar Cliente, con un parámetro de ID
  { path: 'actualizar-cliente/:id', component: ActualizarClienteComponent },

  {
    path: 'app', // Prefijo para rutas de la aplicación que usan TemplateComponent
    component: TemplateComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      // aca se dejo por si hay q añadir más rutas que usen el layout del TemplateComponent si es necesario
    ],
  },

  // Ruta comodín para cualquier otra URL no definida, redirige a 'login'
  { path: '**', redirectTo: 'login' },
];