import { Component, inject } from '@angular/core';
import { TournamentService } from '../tournament.service';
import { Player } from '../../models/player';
import { Round } from '../../models/tournament';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-player-tables',
  standalone: true,
  imports: [NgClass],
  templateUrl: './player-tables.component.html',
  styleUrl: './player-tables.component.scss',
})
export class PlayerTablesComponent {
  tournamentService = inject(TournamentService);
  getTableNumber(round: Round, player: Player) {
    return round.tables.find((t) => t.seats.find((s) => s.player.name === player.name))?.number;
  }
}
