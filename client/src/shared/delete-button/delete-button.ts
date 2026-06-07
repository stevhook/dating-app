import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  imports: [],
  templateUrl: './delete-button.html',
  styleUrl: './delete-button.css',
})
export class DeleteButton {
  isDisabled = input<boolean>();
  isClicked = output<void>();

  protected onClick() {
    this.isClicked.emit();
  }
}
