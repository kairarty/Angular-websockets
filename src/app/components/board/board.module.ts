import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../pages/auth/auth.guard';
import { FormsModule } from '@angular/forms';
import { TopbarModule } from '../topbar/topbar.module';
import { InlineFormModule } from '../inline-form/inline-form.module';
import { LoadingModule } from '../loading/loading.module';
import { UpdateService } from '../../service/update.service';
import { TaskComponent } from './task/task.component';

const routes: Routes = [
  {
    path: 'boards/:boardId',
    component: BoardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'tasks/:taskId',
        component: TaskComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    BoardComponent,
    TaskComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    TopbarModule,
    InlineFormModule,
    LoadingModule
  ],
  providers: [UpdateService]
})
export class BoardModule {
}
