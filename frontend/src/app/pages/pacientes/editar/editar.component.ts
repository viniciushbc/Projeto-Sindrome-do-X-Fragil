/*mport { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// 1. IMPORTAÇÕES DO ANGULAR FORMS (Trocado FormsModule por ReactiveFormsModule)
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

// IMPORTAÇÕES DO PRIMENG
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api'; 

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule, // Mudança aqui
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

  // Criação do grupo do formulário com os mesmos nomes anteriores
  formulario = new FormGroup({
    nome: new FormControl(''),
    cpf: new FormControl(''),
    dataNascimento: new FormControl<Date | null>(null),
    sexo: new FormControl(null),
    telefone: new FormControl(''),
    responsavel: new FormControl(''),
    observacoes: new FormControl('')
  });

  sexos = [
    { nome: 'Masculino' },
    { nome: 'Feminino' }
  ];

  salvar() {
    // Para acessar os dados agora, usamos o .value do formulário
    console.log('Dados do formulário:', this.formulario.value);
  }
}*/