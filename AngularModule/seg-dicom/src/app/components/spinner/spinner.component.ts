import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  static activateSpinner() {
    document.getElementById("spinner")!.style.visibility = "visible";
  }

  static deactivateSpinner() {
    document.getElementById("spinner")!.style.visibility = "hidden";
  }
}
