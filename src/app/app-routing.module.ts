import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ValidacaoComponent } from './components/validacao/validacao.component';
import { SucessoComponent } from './components/sucesso/sucesso.component';
import { ChamadoComponent } from './components/chamado/chamado.component';
import { SimulacaoComponent } from './components/simulacao/simulacao.component';
import { Guarda } from './guards/guarda';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'simulacao', component: SimulacaoComponent },
  { path: 'sucesso', component: SucessoComponent, canActivate: [Guarda] },
  { path: 'validacao', component: ValidacaoComponent, canActivate: [Guarda] },
  //{ path: 'chamado', component: ChamadoComponent, canActivate: [Guarda] },
  { path: 'chamado', component: ChamadoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
