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
  // Declara la propiedad, pero no la inicialiazmos
  readonly globalIsLoading; // No inicializar  acaaaa!

  constructor(private globalStatusService: GlobalStatusService) {

    this.globalIsLoading = this.globalStatusService.isLoading;
  }
}
