import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Hero } from '../../interfaces/hero.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: [
  ]
})
export class SearchPageComponent implements OnInit {
  public searchInput = new FormControl('')
  public heroes: Hero[] = []

  constructor(private heroesService: HeroesService) { }

  ngOnInit(): void {
  }

  searchHero() {
    const value = this.searchInput.value || ''

    this.heroesService.getSuggestions(value).subscribe(heroes => this.heroes = heroes)
  }

  onSelectedOption(event: MatAutocompleteSelectedEvent): void {
    const hero = event.option.value
    this.searchInput.setValue(hero.superhero)

  }

}
