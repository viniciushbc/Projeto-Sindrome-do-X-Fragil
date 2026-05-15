import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Importações do PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext'; // Importante para os campos de texto

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    CardModule, 
    ButtonModule, 
    InputTextModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css', // Mantenha .css se o arquivo físico for .css
  encapsulation: ViewEncapsulation.None // FORÇA o CSS a funcionar na tela
})
export class LoginComponent {
  
  // Função para testar o clique do botão
  fazerLogin() {
    console.log("Tentativa de login capturada!");
  }

}