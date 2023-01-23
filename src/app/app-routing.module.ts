import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ValidacaoComponent } from './components/validacao/validacao.component';
import { ChamadoComponent } from './components/chamado/chamado.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'validacao', component: ValidacaoComponent },
  { path: 'chamado', component: ChamadoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
