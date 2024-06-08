import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Case } from '../interfaces/case';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private readonly caseApiUrl = `${environment.apiUrl}${environment.caseEndpoint}`;

  constructor(
    private httpClient: HttpClient
  ) { }

  createCase(caseToCreate: Case, dicoms: File[]): Observable<number> {
    const formData: FormData = new FormData();

    formData.append('name', caseToCreate.name);
    formData.append('description', caseToCreate.description);

    dicoms.forEach((dicom: File) => {
      formData.append('dicoms', dicom);
    })

    return this.httpClient.post<number>(
        `${this.caseApiUrl}${environment.createEndpoint}`,
        formData
      );
  }

  updateCase(editedCase: Case): Observable<any> {
    return this.httpClient.put(
        `${this.caseApiUrl}${environment.updateEndpoint}`,
        editedCase
      );
  }

  deleteCase(id: number): Observable<any> {
    return this.httpClient.delete(`${this.caseApiUrl}${environment.deleteEndpoint}${id}`);
  }

  getAllCases(): Observable<Case[]> {
    return this.httpClient.get<Case[]>(`${this.caseApiUrl}${environment.getAllEndpoint}`);
  }

  getCase(id: number): Observable<Case> {
    return this.httpClient.get<Case>(`${this.caseApiUrl}${environment.getEndpoint}${id}`);
  }
}
