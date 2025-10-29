import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet],

  // Ahora el HTML vive directamente aquí. Ya no necesitamos app.component.html
  template: '<router-outlet></router-outlet>',
  
  // Eliminamos la dependencia de app.component.css
  styles: [] 
})
export class AppComponent {
  title = 'pedis22'; 
}