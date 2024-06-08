import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { ToastComponent } from "./components/toast/toast.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageCodes } from './enums/language-codes.enum';
import { SpinnerComponent } from './components/spinner/spinner.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
        RouterOutlet,
        MenuComponent,
        ToastComponent,
        TranslateModule,
        SpinnerComponent
    ],
})
export class AppComponent {
    constructor(translateService: TranslateService) {
        translateService.setDefaultLang(LanguageCodes.English);
        
        let setLanguage: string | null = localStorage.getItem('language');
        if (setLanguage) {
            translateService.use(setLanguage);
        } else if ([LanguageCodes.English.toString(), LanguageCodes.French.toString(), LanguageCodes.Japanese.toString(), LanguageCodes.Vietnamese.toString()]
                .includes(navigator.language.slice(0, 2))) {
            translateService.use(navigator.language.slice(0, 2));
        }
    }
}