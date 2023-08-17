import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  })

  get currentHero(): Hero {
    return this.heroForm.value as Hero
  }

  public publishers = [
    { id: 'DC Comics', desc: "DC - Comics" },
    { id: 'Marvel Comics', desc: "Marvel - Comics" }
  ]

  constructor(private heroesService: HeroesService, private router: Router, private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) {
      return

    }
    this.activatedRoute.params.pipe(
      switchMap(({ id }) => this.heroesService.getHeroById(id))
    ).subscribe(hero => {
      // if (!hero) this.router.navigateByUrl('/')
      if (!hero) this.router.navigate(['/'])
      this.heroForm.reset(hero)
    })
  }

  onSubmit() {
    if (this.heroForm.invalid) return

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackbar(`${hero.superhero} updated!`)
        })
      return
    }

    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
        //TODO: Mostrar snackbar y navegar al nuevo heroe /hero/edit/hero.id
        this.router.navigate(['/heroes/edit', hero.id])
        this.showSnackbar(`${hero.superhero} updated!`)

      })
  }

  onDeleteHero() {
    if (!this.currentHero.id) throw Error('Hero id is required')

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: this.heroForm.value
    })

    dialogRef.afterClosed().pipe(
      filter(result => result),
      switchMap(() => this.heroesService.deleteHero(this.currentHero.id)),
      filter(wasDeleted => wasDeleted)
    ).subscribe(() =>
      this.router.navigate(['/heroes'])

    )

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('Confirm Dialog close', { result })
    //   if (!result) return
    //   this.heroesService.deleteHero(this.currentHero.id)
    //   this.router.navigate(['/heroes'])
    // })
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'done', { duration: 2500 })
  }
}
