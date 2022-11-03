import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BoardsComponent } from './boards.component';
import { InlineFormModule } from '../../components/inline-form/inline-form.module';
import { AuthGuard } from '../auth/auth.guard';
import { TopbarModule } from '../../components/topbar/topbar.module';
import { LoadingModule } from '../../components/loading/loading.module';

const routes: Routes = [
  {
    path: 'boards',
    component: BoardsComponent,
    canActivate: [AuthGuard]    // проверка если залогинен, то пускает, если нет - перенаправляет на главную
  }
];

@NgModule({
  declarations: [BoardsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    InlineFormModule,
    TopbarModule,
    LoadingModule
  ]
})
export class BoardsModule {
}
