import { Component } from '@angular/core';
import { RouterLink} from '@angular/router'

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [RouterLink, CardModule, ButtonModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent {

}
