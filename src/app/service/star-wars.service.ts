import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StarWarsService {
  private apiUrl = 'https://swapi.dev/api';

  constructor(private http: HttpClient) { }

  getPeople(): Observable<any> {
    return this.http.get(`${this.apiUrl}/people/`);
  }

  getPerson(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/people/${id}/`);
  }

  getFilms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/films/`);
  }

}
