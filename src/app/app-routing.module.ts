import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ValidacaoComponent } from './components/validacao/validacao.component';
import { ChamadoComponent } from './components/chamado/chamado.component';
import { Guarda } from './guards/guarda';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  //{ path: ':tk', component: WelcomeComponent },
  { path: 'validacao', component: ValidacaoComponent, canActivate: [Guarda] },
  { path: 'chamado', component: ChamadoComponent, canActivate: [Guarda] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
