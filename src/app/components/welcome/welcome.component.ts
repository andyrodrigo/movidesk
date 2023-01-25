import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import { Observable } from 'rxjs';

import { ValidacaoService } from 'src/app/services/validacao.service';
import { AutorizaService } from 'src/app/services/autoriza.service';
import { CriptoService } from 'src/app/services/cripto.service';

@Component({
  selector: 'top-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  usuario: any;
  emailFornecido: string = '';
  token: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private validacaoService: ValidacaoService,
    private autorizaService: AutorizaService,
    private criptoService: CriptoService
  ) {}

  ngOnInit(): void {
    sessionStorage.clear();
    this.validacaoService.consultarUsuario().subscribe((valor: any) => {
      this.usuario = valor;
    });

    const token = 'Andy';
    console.log('usuario: ', token);
    const _criptToByte = this.criptoService.Aes_EncryptString_ToBytes(token);
    console.log('_criptToByte : ', _criptToByte);
    const base64 = this.criptoService.Aes_EncryptString_ToBase64String(
      _criptToByte.toString()
    );
    console.log('base64 : ', base64);
    const tk = this.criptoService.ConvertStringToHex(base64);
    console.log('tk : ', tk);
    const base = this.criptoService.ConvertHexToString(tk);
    console.log('base : ', base);
    const bt = this.criptoService.fromBase64String('Bm6xPhZ695Omcid6RPotMw==');
    console.log('bt : ', bt);
    const novo = this.criptoService.Aes_DecryptString_FromBase64String(
      'Bm6xPhZ695Omcid6RPotMw=='
    );
    console.log('novo : ', novo);
    const final = this.criptoService.Aes_DecryptString_FromBytes(_criptToByte);
    console.log('final : ', final);
    //_infoCliente = this.criptoService.
    // this.activatedRoute.queryParams.subscribe((params) => {
    //   const teste1 = '75322541';
    //   console.log('teste1:', teste1);
    //   const teste2 = this.criptoService.encrypt2(teste1);
    //   console.log('teste2:', teste2);
    //   const teste3 = this.criptoService.decrypt2(teste2);
    //   console.log('teste3:', teste3);

    //   // const teste5 = this.criptoService.hexToString(teste4);
    //   // console.log('teste5:', teste5);
    //   // // const teste6 = this.criptoService.decodificarBase64(teste5);
    //   // // console.log('teste6:', teste6);
    //   // // const teste7 = this.criptoService.decrypt(teste6);
    //   // // console.log('teste7: saida', teste7);

    //   // console.log(params);
    //   // this.token = params['tk'];
    //   // console.log(this.token);
    //   // const hexToString = this.criptoService.hexToString(this.token);
    //   // console.log('hexToString: ', hexToString);
    //   // const decode64 = this.criptoService.decode64(hexToString);
    //   // console.log('decode64: ', decode64);
    //   // const decodeAes = this.criptoService.decrypt2(this.token);
    //   // console.log('decodeAes: ', decodeAes);
    // });
  }

  ngOnDestroy(): void {}

  protected enviarCodigo(): void {
    const autorizacao = this.autorizaService.autorizar('autorizado');
    if (autorizacao) {
      this.usuario.email = this.emailFornecido;
      this.validacaoService.escreverUsuario(this.usuario);
      const codigoGerado = this.numeroAleatorio(100000, 999999).toString();
      const codigoCriptado = this.criptoService.codificarMD5(codigoGerado);
      sessionStorage.setItem('codigoGravado', JSON.stringify(codigoCriptado));
      //console.log(codigoGerado);
      this.validacaoService
        .enviarEmail(this.emailFornecido, Number(codigoGerado))
        .subscribe(() => {});
      this.router.navigate(['/validacao']);
    }
  }

  private numeroAleatorio(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}
