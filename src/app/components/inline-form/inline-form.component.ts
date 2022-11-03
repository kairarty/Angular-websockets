import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-inline-form',
  templateUrl: './inline-form.component.html',
  styleUrls: ['./inline-form.component.scss']
})
export class InlineFormComponent {
  @Input() title = '';
  @Input() defaultText = 'Not defined';
  @Input() hasButton = false;
  @Input() btnText = 'Submit';
  @Input() inputPlaceholder = '';
  @Input() inputType = 'input';

  @Output() handleSubmit = new EventEmitter<string>();

  isEditing = false;
  form = this.fb.group({
    title: ['']
  });

  constructor(private fb: FormBuilder) {
  }

  activeEditing() {
    if (this.title) {
      this.form.patchValue({title: this.title});
    }
    this.isEditing = true;
  }

  onSubmit() {
    const title = this.form.value.title;
    if (title) {
      this.handleSubmit.emit(title);
    }
    this.isEditing = false;
    this.form.reset();
  }

}
