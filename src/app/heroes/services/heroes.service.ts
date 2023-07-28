import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hero } from '../interfaces/hero.interface';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class HeroesService {
    private url = environment.baseUrl

    constructor(private httpClient: HttpClient) { }

    getHeroes(): Observable<Hero[]> {
        return this.httpClient.get<Hero[]>(`${this.url}/heroes`)
    }

    getHeroById(id: string): Observable<Hero | undefined> {
        return this.httpClient.get<Hero>(`${this.url}/heroes/${id}`)
            .pipe(
                catchError(error => of(undefined))
            )
    }

    getSuggestions(query: string): Observable<Hero[]> {
        return this.httpClient.get<Hero[]>(`${this.url}/heroes?q=${query}&_limit=6`)
    }

}