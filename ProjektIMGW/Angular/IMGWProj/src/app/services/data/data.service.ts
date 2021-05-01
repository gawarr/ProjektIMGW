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

  AgriculturalTechniquesAdd(data): Observable<any> {
    return this.http.post(`${baseUrl}AgriculturalTechniquesAdd`, data)
  }

  CurrentConditionsGet(data): Observable<any> {
    return this.http.post(`${baseUrl}CurrentConditionsGet`, data)
  }

  CurrentConditionsAdd(data): Observable<any> {
    return this.http.post(`${baseUrl}CurrentConditionsAdd`, data)
  }

  EventsGet(data): Observable<any> {
    return this.http.post(`${baseUrl}EventsGet`, data)
  }

  EventsAdd(data): Observable<any> {
    return this.http.post(`${baseUrl}EventsAdd`, data)
  }

  ActionsListGet() {
    return this.http.get(`${baseUrl}Actions`)
  }

  PlantTypesListGet() {
    return this.http.get(`${baseUrl}PlantTypes`)
  }

  CultivationStatesListGet() {
    return this.http.get(`${baseUrl}CultivationStates`)
  }

  EventsListGet() {
    return this.http.get(`${baseUrl}EventTypes`)
  }
}
