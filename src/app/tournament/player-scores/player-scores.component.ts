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

    return (
      round?.tables
        .find((t) => t.seats.some((seat) => seat.player.id === player.id))
        ?.seats.find((seat) => seat.player.id === player.id)?.finalScore || 0
    );
  }

  getFinalScore(player: Player) {
    return (
      this.tournamentService
        .tournament()
        ?.rounds.map((round) => {
          const playerTables = round.tables.filter((table) => table.seats.some((s) => s.player.id === player.id));
          const playerSeats = playerTables
            .map((t) => {
              return t.seats.filter((s) => s.player.id === player.id);
            })
            .flat();
          return playerSeats.reduce((prev, cur) => (cur.finalScore ?? 0) + prev, 0);
        })
        .reduce((sum, cur) => sum + cur) ?? 0
    );
  }

  sortPlayers() {
    return [...this.tournamentService.tournament()?.players!].sort((a, b) => this.getFinalScore(b) - this.getFinalScore(a));
  }
}
