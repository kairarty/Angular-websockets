import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineFormComponent } from './inline-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [InlineFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [InlineFormComponent]  // для возможности использования компонента вне директории
})
export class InlineFormModule {
}
