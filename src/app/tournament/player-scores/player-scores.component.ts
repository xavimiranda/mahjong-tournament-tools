import { Component, inject } from '@angular/core';
import { TournamentService } from '../tournament.service';
import { Player } from '../../models/player';

@Component({
  selector: 'app-player-scores',
  standalone: true,
  imports: [],
  templateUrl: './player-scores.component.html',
  styleUrl: './player-scores.component.scss',
})
export class PlayerScoresComponent {
  tournamentService = inject(TournamentService);

  getScoreInRound(player: Player, roundNumber: number): number {
    const round = this.tournamentService.tournament()?.rounds[roundNumber];

    return round?.tables
      .find((t) => t.seats.some((seat) => seat.player.id === player.id))
      ?.seats.find((seat) => seat.player.id === player.id)?.finalGameScore || 0;
  }

  getFinalScore(player: Player) {
    this.tournamentService.tournament()?.rounds.map(round => {
      const playerTables = round.tables.filter(table => table.seats.some(s => s.player.id === player.id))
      const playerSeats = playerTables.map(t => {return t.seats.filter(s => s.player.id === player.id)}).flat()
      return  playerSeats.reduce((prev, cur) => cur.finalGameScore || 0 + prev, 0)
    })
  }
}
