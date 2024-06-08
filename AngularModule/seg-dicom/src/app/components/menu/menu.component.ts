import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastComponent } from '../toast/toast.component';
import { ToastTypes } from '../../enums/toast-types.enum';
import { RouteLinks } from '../../enums/routes-links.enum';
import { IconNames } from '../../enums/icon-names.enum';
import { LanguageCodes } from '../../enums/language-codes.enum';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    ToastComponent
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  RouteLinks = RouteLinks;

  navDisplayStatus: boolean;
  navDisplayIcon: string;
  readonly openIcon: string = IconNames.X;
  readonly closeIcon: string = IconNames.Bars;

  themeStatus: boolean;
  themeSwitchIcon: string;
  readonly darkTheme: string = "dark";
  readonly darkIcon: string = IconNames.Sun;
  readonly lightIcon: string = IconNames.Moon;

  readonly menuWidth: string = "210px";
  readonly menuWidthVN: string = "330px";

  constructor(private translateService: TranslateService) {
    this.navDisplayStatus = false;
    this.navDisplayIcon = this.closeIcon;

    let setTheme: string | null = localStorage.getItem('theme');
    this.themeStatus =
      window.matchMedia && window.matchMedia(`(prefers-color-scheme: ${this.darkTheme})`).matches &&
      (setTheme == this.darkTheme || !setTheme);
    this.themeSwitchIcon = this.darkIcon;
    this.switchColorTheme(true);
  }

  openOrCloseNav() {
    if (this.navDisplayStatus) {
      this.closeNav();
    } else {
      this.openNav();
    }
  }

  openNav() {
    var openWidth: string = this.translateService.currentLang == LanguageCodes.Vietnamese ? this.menuWidthVN : this.menuWidth

    document.getElementById("menu")!.style.width = openWidth;
    document.getElementById("main")!.style.marginLeft = openWidth;
    this.navDisplayStatus = true;
    this.navDisplayIcon = this.openIcon;
  }

  closeNav() {
    document.getElementById("menu")!.style.width = "0";
    document.getElementById("main")!.style.marginLeft= "0";
    this.navDisplayStatus = false;
    this.navDisplayIcon = this.closeIcon;
  }

  switchColorTheme(force: boolean = false) {
    if (force) {
      if (this.themeStatus) {
        document.getElementById("body")!.classList.add(this.darkTheme);
        this.themeStatus = true;
        this.themeSwitchIcon = this.darkIcon;
      } else {
        document.getElementById("body")!.classList.remove(this.darkTheme);
        this.themeStatus = false;
        this.themeSwitchIcon = this.lightIcon;
      }
    }

    if (!force) {
      if (this.themeStatus) {
        document.getElementById("body")!.classList.remove(this.darkTheme);
        this.themeStatus = false;
        this.themeSwitchIcon = this.lightIcon;
        ToastComponent.displayToastMessage(ToastTypes.Info, "Nav.SwitchedToLightModeInfo");
      } else {
        document.getElementById("body")!.classList.add(this.darkTheme);
        this.themeStatus = true;
        this.themeSwitchIcon = this.darkIcon;
        ToastComponent.displayToastMessage(ToastTypes.Info, "Nav.SwitchedToDarkModeInfo");
      }
    }
  }
}