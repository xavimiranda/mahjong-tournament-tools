import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { TournamentService } from '../../tournament/tournament.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgStyle, TitleCasePipe } from '@angular/common';
import { PlayerSeat, Round, SEAT_WINDS, Table } from '../../models/tournament';
import { ToastrService } from '../../services/toastr.service';

@Component({
  selector: 'app-round-scoring',
  standalone: true,
  imports: [FormsModule, TitleCasePipe, NgClass, NgStyle],
  templateUrl: './round-scoring.component.html',
  styleUrl: './round-scoring.component.scss',
})
export class RoundScoringComponent implements OnInit {

  SEAT_WINDS = SEAT_WINDS;
  selectedRound: number = 0;
  selectedTable: number = 1;
  leftOverSticks: number = 0;
  seats = signal<PlayerSeat[]>([]);
  table = signal<Table | null>(null);
  errors = signal<string[]>([]);
  validScore = signal<boolean>(false);
  tournamentService = inject(TournamentService);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.getTable();
  }

  /** fetches a table by its round and number from the tournament service */
  getTable() {
    const table = this.tournamentService.getTable(this.selectedRound, this.selectedTable);
    if (table) {
      this.seats.set(table.seats.map((seat) => ({ ...seat })));
      this.table.set(table);
    }
  }

  /** Checks if a round has table to score, by checking if every table for that round is scored */
  hasTablesToScore(round: Round) {
    return !round.tables.every((t) => t.scored);
  }


  validateTable() {
    this.validScore.set(false);
    this.errors.set([]);
    this.validateWinds();
    this.validateScores();

    if (this.errors().length === 0) {
      this.validScore.set(true);
      this.calculateScores();
    }
  }

  invalidate() {
    this.validScore.set(false);
  }

  commitScore() {
    this.tournamentService.commitScore(this.selectedRound, this.selectedTable, this.seats());
    this.getTable();
    this.toastr.info('To save your score, remember to save the tournament in your browser.\nClick me to save now!', {
      timeOut: 10000,
      progressBar: true,
      onclick: () => this.tournamentService.saveTournamentToLocalStorage(),
    });
  }

  private calculateScores() {
    const seats = this.seats();
    if (!seats) return;

    const settings = this.tournamentService.tournament()?.settings;
    if (!settings) return;
    seats.forEach((seat) => (seat.net = (seat.gameScore ?? 0) - (seat.loan ?? 0)));
    // Sort seats by final game score in descending order
    const sortedSeats = seats.sort((a, b) => (b.net ?? 0) - (a.net ?? 0));

    // Initialize variables
    let seatNumber = 1;
    let currentPlacement = 0;
    const placementGroups: PlayerSeat[][] = [[], [], [], []];

    // Group players by score
    placementGroups[currentPlacement].push(sortedSeats[0]);
    while (seatNumber < 4) {
      if (sortedSeats[seatNumber].gameScore === placementGroups[currentPlacement][0].gameScore) {
        placementGroups[currentPlacement].push(sortedSeats[seatNumber]);
      } else {
        currentPlacement++;
        placementGroups[currentPlacement].push(sortedSeats[seatNumber]);
      }
      seatNumber++;
    }

    // Remove empty groups
    const filledPlacementGroups = placementGroups.filter((group) => group.length > 0);

    // Define Uma values
    const umas = [
      settings.firstPlaceUma ?? 0,
      settings.secondPlaceUma ?? 0,
      settings.thirdPlaceUma ?? 0,
      settings.fourthPlaceUma ?? 0,
    ];

    // Calculate Uma for each placement
    const finalUmas = new Array(filledPlacementGroups.length).fill(0);
    let umasIdx = 0;
    filledPlacementGroups.forEach((group, index) => {
      let groupSize = group.length;
      while (groupSize > 0) {
        finalUmas[index] += umas[umasIdx];
        umasIdx++;
        groupSize--;
      }
    });

    // Assign Uma to each player
    filledPlacementGroups.forEach((group, index) => {
      const averageUma = finalUmas[index] / group.length;
      group.forEach((seat) => (seat.uma = averageUma));
    });

    // Calculate final score for each player
    seats.forEach((seat) => {
      seat.delta = (seat.net ?? 0) - (settings.startingGameScore ?? 0);
      seat.finalScore = (seat.delta ?? 0) / 1000 + (seat.uma ?? 0);
    });
  }

  private validateWinds() {
    const winds = { east: false, south: false, west: false, north: false };
    this.seats().forEach((seat) => {
      if (!seat.wind) {
        this.errors.update((errors) => [...errors, `${seat.player.name} doesn't have a seat wind`]);
        return;
      }
      if (winds[seat.wind])
        this.errors.update((errors) => [
          ...errors,
          `There are more than one ${seat.wind?.replace(/^\w/, (s) => s.toUpperCase())} seat`,
        ]);
      winds[seat.wind] = true;
    });
  }

  private validateScores() {
    const startScore = this.tournamentService.tournament()?.settings.startingGameScore!;
    const maxScore = startScore * 4;

    const totalScore = this.seats().reduce((sum, seat) => sum + (seat.gameScore ?? 0), 0);
    const totalLoans = this.seats().reduce((sum, seat) => sum + (seat.loan ?? 0), 0);

    if (totalScore - totalLoans + this.leftOverSticks !== maxScore)
      this.errors.update((e) => [
        ...e,
        `Scores and leftover sticks don't match up to ${maxScore} (total: ${totalScore}-${totalLoans} = ${totalScore - totalLoans})`,
      ]);
  }
}
