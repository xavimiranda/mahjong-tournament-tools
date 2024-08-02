import { Routes } from '@angular/router';
import { SeatingComponent } from './seating/seating/seating.component';
import { generationInProgressGuard } from './seating/generation-in-progress.guard';
import { HomeComponent } from './home/home.component';
import { TournamentHomeComponent } from './tournament/tournament-home/tournament-home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hanchan', component: SeatingComponent, canDeactivate: [generationInProgressGuard] },
  { path: 'tournament', component: TournamentHomeComponent },
  { path: '**', component: HomeComponent, pathMatch: 'full' },
];
