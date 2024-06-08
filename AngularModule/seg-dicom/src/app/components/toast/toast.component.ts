import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IconNames } from '../../enums/icon-names.enum';
import { ToastTypes } from '../../enums/toast-types.enum';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  static message: string;
  static toastIcon: string;
  static parameters: any;

  get message() {
    return ToastComponent.message;
  }
  
  get toastIcon() {
    return ToastComponent.toastIcon;
  }
  
  get parameters() {
    return ToastComponent.parameters;
  }

  static displayToastMessage(type: string, message: string, parameters: any = null) {
    var x = document.getElementById("toast");

    x!.className = "show";

    x!.classList.add(type);

    this.toastIcon = "";

    switch (type) {
      case ToastTypes.Success:
        this.toastIcon = IconNames.Check;
        break;
      case ToastTypes.Info:
        this.toastIcon = IconNames.Info;
        break;
      case ToastTypes.Error:
        this.toastIcon = IconNames.Error;
        break;
      case ToastTypes.Warning:
        this.toastIcon = IconNames.Warning;
        break;
    }

    this.message = message;

    this.parameters = parameters;

    setTimeout(
      function() {
        x!.className = x!.className.replace("show", "");
        x!.classList.remove(type);
      },
      2000
    );
  }
}
