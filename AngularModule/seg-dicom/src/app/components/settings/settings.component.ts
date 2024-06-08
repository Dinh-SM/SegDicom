import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageCodes } from '../../enums/language-codes.enum';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  LanguageCodes = LanguageCodes;

  constructor(
    private translateService: TranslateService
  ) { }

  changeLanguage(languageCode: string) {
    let setLanguage: string | null = localStorage.getItem('language');
    if (setLanguage !== languageCode) {
      this.translateService.use(languageCode);
      localStorage.setItem('language', languageCode);
    }
  }

  changeTheme(theme: string) {
    let setTheme: string | null = localStorage.getItem('theme');
    if (setTheme !== theme) {
      this.translateService.use(theme);
      localStorage.setItem('theme', theme);
      location.reload();
    }
  }
}
