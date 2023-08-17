import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hero } from '../interfaces/hero.interface';
import { Observable, catchError, map, of } from 'rxjs';
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

    addHero(hero: Hero): Observable<Hero> {
        return this.httpClient.post<Hero>(`${this.url}/heroes`, hero)
    }

    updateHero(hero: Hero): Observable<Hero> {
        if (!hero.id) throw Error('Hero id is required')
        return this.httpClient.patch<Hero>(`${this.url}/heroes/${hero.id}`, hero)
    }

    deleteHero(id: string): Observable<boolean> {
        return this.httpClient.delete(`${this.url}/heroes/${id}`)
            .pipe(
                map(res => true),
                catchError(error => of(false)),
            )
    }

}