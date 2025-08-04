import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalStatusService } from '../../services/global-status.service';

@Component({
  selector: 'app-template',
  imports: [RouterOutlet],
  templateUrl: './template.component.html',
  styleUrl: './template.component.css',
})
 export class TemplateComponent {
  // Declara la propiedad, pero no la inicialices aquí
  readonly globalIsLoading; // ¡IMPORTANTE: No la inicialices aquí!

  constructor(private globalStatusService: GlobalStatusService) {
    // ¡Inicializa globalIsLoading DENTRO del constructor!
    // Ahora 'this.globalStatusService' ya está disponible.
    this.globalIsLoading = this.globalStatusService.isLoading;
  }
}
