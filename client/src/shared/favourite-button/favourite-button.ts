import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-favourite-button',
  imports: [],
  templateUrl: './favourite-button.html',
  styleUrl: './favourite-button.css',
})
export class FavouriteButton {
  isSelected = input(false);
  isDisabled = input(false);
  isClicked = output<void>();

  protected clickFavourite() {
    this.isClicked.emit();
  }
}
