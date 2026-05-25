import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';



// Importações do PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext'; 

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
  styleUrl: './login.component.css', 
  encapsulation: ViewEncapsulation.None 
})
export class LoginComponent {
  

  fazerLogin() {
    console.log("Tentativa de login capturada!");
  }

}