import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StarWarsService {
  private apiUrl = 'https://swapi.dev/api';

  constructor(private http: HttpClient) { }

  getPeople(): Observable<any> {
    return this.http.get(`${this.apiUrl}/people/`);
  }

  getPersonId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/people/${id}/`);
  }

  getFilms(filmUrls: string[]): Observable<any[]> {
    const filmCalls = filmUrls?.map((url: string) => this.http.get(url)) ?? [];
    return forkJoin(filmCalls);
  }

  getResourceByUrl(urls: string[]): Observable<any[]> {
    const resourceCalls = urls?.map((url: string) => this.http.get(url)) ?? [];
    return forkJoin(resourceCalls);
  }

}
