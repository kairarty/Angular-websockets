import { NgModule } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    CommonModule
  ]
})
export class AuthModule {

}
