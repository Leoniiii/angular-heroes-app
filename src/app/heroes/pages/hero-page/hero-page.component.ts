import { ActivatedRoute, Router } from '@angular/router';
import { HeroesService } from './../../services/heroes.service';
import { Component, OnInit } from '@angular/core';
import { delay, switchMap } from 'rxjs';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: [
  ]
})
export class HeroPageComponent implements OnInit {
  hero?: Hero
  constructor(private heroesService: HeroesService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      delay(1000),
      switchMap(({ id }) => this.heroesService.getHeroById(id))

    ).subscribe((hero) => {
      if (!hero) this.router.navigate(['/heroes/list'])
      this.hero = hero

    })
  }

  goBack(): void {
    this.router.navigate(['/heroes/list'])
  }

}
