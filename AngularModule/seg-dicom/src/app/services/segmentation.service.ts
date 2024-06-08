import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SegmentationService {
  private readonly segmentationApiUrl = `${environment.azureFunctionUrl}${environment.azureFunctionEndpoint}`;

  constructor(
    private httpClient: HttpClient
  ) { }

  exportSegmentation(blobContainerId: string): Observable<string> {
    return this.httpClient.get(`${this.segmentationApiUrl}${blobContainerId}`, {responseType: 'text'});
  }
}
