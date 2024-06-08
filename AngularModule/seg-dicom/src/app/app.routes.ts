import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CreateCaseComponent } from './components/create-case/create-case.component';
import { CaseListComponent } from './components/case-list/case-list.component';
import { CasePageComponent } from './components/case-page/case-page.component';
import { SettingsComponent } from './components/settings/settings.component';
import { RouteLinks } from './enums/routes-links.enum';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: RouteLinks.CreateCase,
        component: CreateCaseComponent
    },
    {
        path: RouteLinks.CaseList,
        component: CaseListComponent},
    {
        path: RouteLinks.CasePage + '/:caseId',
        component: CasePageComponent
    },
    {
        path: RouteLinks.Settings,
        component: SettingsComponent
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    },
];
