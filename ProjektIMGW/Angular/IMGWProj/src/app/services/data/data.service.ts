import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  AgriculturalTechniquesGet(data): Observable<any> {
    return this.http.post(`${baseUrl}AgriculturalTechniquesGet`, data)
  }

  CurrentConditionsGet(data): Observable<any> {
    return this.http.post(`${baseUrl}CurrentConditionsGet`, data)
  }

  EventsGet(data): Observable<any> {
    return this.http.post(`${baseUrl}EventsGet`, data)
  }
}
