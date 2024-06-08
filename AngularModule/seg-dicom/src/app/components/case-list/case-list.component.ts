import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CaseService } from '../../services/case.service';
import { ToastComponent } from '../toast/toast.component';
import { ToastTypes } from '../../enums/toast-types.enum';
import { Case } from '../../interfaces/case';
import { HttpErrorResponse } from '@angular/common/http';
import { take } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-case-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule],
  templateUrl: './case-list.component.html',
  styleUrl: './case-list.component.css'
})
export class CaseListComponent {
  cases: Case[] = [];

  constructor(
    private caseService: CaseService
  ) {
    SpinnerComponent.activateSpinner();

    this.caseService
      .getAllCases()
      .pipe(take(1))
      .subscribe({
        next: (cases: any) => {
          this.cases = cases
          SpinnerComponent.deactivateSpinner();
        },
        error: (error: HttpErrorResponse) => {
          if (environment.debug) {
            console.error(error);
          }
          ToastComponent.displayToastMessage(ToastTypes.Error, error.message);
          SpinnerComponent.deactivateSpinner();
        }
      });
  }
}