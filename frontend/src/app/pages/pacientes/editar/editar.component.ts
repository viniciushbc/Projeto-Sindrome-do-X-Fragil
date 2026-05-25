import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// 1. IMPORTAÇÕES DO PRIMENG
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api'; 

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CommonModule,
    FormsModule,
    CalendarModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    InputTextareaModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService], 
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.css'
 
})
export class EditarComponent {

  visivel: boolean = true;
  data: any;
  nome = '';
  cpf = '';
  sexo = '';
  telefone = '';
  responsavel = '';
  observacoes = '';

  dataNascimento: Date | undefined;

  sexos = [
    { nome: 'Masculino' },
    { nome: 'Feminino' }
  ];

  salvar() {
    console.log('Salvou!');
  }

}