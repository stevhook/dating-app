import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-favourite-button',
  imports: [],
  templateUrl: './favourite-button.html',
  styleUrl: './favourite-button.css',
})
export class FavouriteButton {
  protected isSelected = input(false);
  protected isDisabled = input(false);
  protected isClicked = output<void>();

  protected clickFavourite() {
    this.isClicked.emit();
  }
}
