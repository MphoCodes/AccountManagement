import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl = `${environment.apiUrl}/Person`;

  constructor(private http: HttpClient) { }

  getPersons(searchTerm?: string): Observable<Person[]> {
    let url = this.apiUrl;
    if (searchTerm) {
      url += `?searchTerm=${encodeURIComponent(searchTerm)}`;
    }
    return this.http.get<Person[]>(url);
  }

  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  createPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(this.apiUrl, person);
  }

  updatePerson(id: number, person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${id}`, person);
  }

  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // For demo purposes, return mock data
  getMockPersons(): Person[] {
    return [
      { code: 1, name: 'REJOCE', surname: 'MAJOLA', id_number: '63XX2907910XX' },
      { code: 2, name: '', surname: 'MOKOMELE', id_number: '70XX2403660XX' },
      { code: 3, name: 'NTOMBIKHONA', surname: 'MLAMBO', id_number: '42XX1002420XX' },
      { code: 4, name: 'KLAAS', surname: 'OCKHUIS', id_number: '39XX1400850XX' },
      { code: 5, name: 'FERDI', surname: 'LUUS', id_number: '59XX0110380XX' },
      { code: 6, name: 'SHAUN', surname: 'LOVELOT', id_number: '67XX1807700XX' },
      { code: 7, name: '', surname: 'MOSOOANE', id_number: '74XX2301550XX' },
      { code: 8, name: '', surname: 'MOTENO', id_number: '59XX1901940XX' },
      { code: 9, name: '', surname: 'ZWANE', id_number: '66XX0354900XX' },
      { code: 10, name: 'JOSEPH', surname: 'MOSWEU', id_number: '72XX1806150XX' }
    ];
  }
} 