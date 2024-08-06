import { Component, inject } from '@angular/core';
import { TournamentService } from '../tournament.service';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss'
})
export class PlayerListComponent {
  tournamentService = inject(TournamentService)
}
