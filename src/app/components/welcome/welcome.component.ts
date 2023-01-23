import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
//import { Observable } from 'rxjs';

import { ValidacaoService } from 'src/app/services/validacao.service';

@Component({
  selector: 'top-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  usuario: any;
  msg: any;

  constructor(
    private router: Router,
    private validacaoService: ValidacaoService
  ) {}

  ngOnInit(): void {
    this.validacaoService.consultarUsuario().subscribe((valor: any) => {
      this.usuario = valor;
    });
  }

  ngOnDestroy(): void {}

  protected enviarCodigo(email: string): void {
    this.usuario.email = email;
    this.validacaoService.escreverUsuario(this.usuario);
    let codigoGerado = this.numeroAleatorio(100000, 999999);
    sessionStorage.setItem('codigoGravado', JSON.stringify(codigoGerado));
    this.router.navigate(['/validacao']);
    //this.validacaoService.enviarEmail(email, codigoGerado).subscribe(() => {});
  }

  protected teste(): void {
    this.validacaoService.teste().subscribe((res) => {
      this.msg = res.body;
    });
  }

  private numeroAleatorio(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}
