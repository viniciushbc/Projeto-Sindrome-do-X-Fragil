import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    MessageModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  carregando = false;
  formularioEnviado = false;

  referencias = [
    {
      titulo: 'Cartilha Eu Digo X',
      url: 'https://www.eudigox.com.br/wp-content/uploads/2022/02/IBK_CARTILHA_DIGITAL.pdf'
    },
    {
      titulo: 'Triagem clínica e FMR1',
      url: 'https://www.scielo.cl/scielo.php?pid=S0370-41062006000100005&script=sci_arttext'
    },
    {
      titulo: 'Prevalência e rastreamento',
      url: 'https://link.springer.com/article/10.1186/gm401'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      senha: ['', Validators.required]
    })
  }

  entrar(): void {
    this.formularioEnviado = true;

    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Campos obrigatórios',
        detail: 'Informe o e-mail/CPF e a senha.'
      });

      return;
    }


    this.carregando = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Login realizado',
          detail: 'Redirecionando...'
        });

        this.router.navigate(['/menu']);

      },

      error: ()=> {
        this.carregando = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Login inválido',
          detail: 'Verifique seus dados de acesso e tente novamente.'
        });
      },
      complete: ()=> {
        this.carregando = false;
      }
    });
  }

  campoInvalido(campo: string):boolean {
    const controle = this.loginForm.get(campo);

    return !!(
      controle &&
      controle.invalid &&
      (controle.touched || this.formularioEnviado)
    )
  }


  esqueciSenha(): void {
    this.messageService.add({
      severity: 'info',
      summary: '',
      detail: 'Funcionalidade ainda nao disponivel'
    });
  }


}
