import { inject, Injectable, OnInit, signal } from '@angular/core';
import { PlayerSeat, Round, SeatingMap, Table, Tournament, TournamentSettings } from '../models/tournament';
import { EncodingService } from '../services/encoding.service';
import moment from 'moment';
import { ToastrService } from '../services/toastr.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {

  tournament = signal<Tournament | null>(null);
  private encodingService = inject(EncodingService);
  private toastr = inject(ToastrService);

  generateTournament(encodedSeating: string) {
    let map: SeatingMap;
    try {
      map = this.encodingService.decodeObject<SeatingMap>(encodedSeating);
    } catch (error) {
      this.toastr.error('Invalid string');
      return;
    }

    const rounds: Round[] = map.rounds.map((round) => {
      return {
        tables: round.map((t, i): Table => {
          const players = t.map((p) => map.players.find((player) => player.id === p)!);
          return {
            number: i + 1,
            scored: false,
            seats: players.map((p) => {
              return { player: p, isSubstitute: p.isSubstitute };
            }),
          };
        }),
      };
    });
    const t: Tournament = {
      players: map.players,
      rounds,
      settings: getTournamentDefaultSettings(),
    };
    this.tournament.set(t);
  }

  loadTournament(encodedTournament: string) {
    try {
      
      const tournament = this.encodingService.decodeObject<Tournament>(encodedTournament);
      tournament.settings.roundDuration = moment.duration(tournament.settings.roundDuration);
      tournament.rounds = tournament.rounds.map(round => {
        if(typeof round.startingTime === 'string')
          round.startingTime = new Date(round.startingTime)
         return round
      })
      this.tournament.set(tournament);
    } catch (error) {
      this.toastr.error("Failed loading tournament") 
      console.error(error)
    }
  }

  loadTournamentFromLocalStorage() {
    const localStorageData = localStorage.getItem('MTT-TOURNAMENT');
    if (localStorageData) {
      this.loadTournament(localStorageData)
    }
  }

  async loadTournamentFromClipboard() {
    const clipboardData = await window.navigator.clipboard.readText()
    if(clipboardData) {
      this.loadTournament(clipboardData)
    }
  }


  saveTournamentToLocalStorage() {
    if (this.tournament())
      try {
        localStorage.setItem('MTT-TOURNAMENT', this.encodingService.encodeObject(this.tournament()!));
        this.toastr.success('Tournament saved in the browser!')
      } catch (error) {
        this.toastr.error('Problem ocurred saving the tournament: ' + error);
      }
  }

  saveTournamentToClipboard() {
    if(this.tournament()) {
      try {
        const encoded = this.encodingService.encodeObject(this.tournament()!)
        navigator.clipboard.writeText(encoded)
        this.toastr.success('Tournament successfully copied to your clipboard!')
      } catch (error) {
        this.toastr.error('Problem enconding the tournament: ' + error);
      }
    }
  }

  savedTournamentExists() {
    return localStorage.getItem('MTT-TOURNAMENT') !== null;
  }

  getTable(round: number, table: number) {
    return this.tournament()?.rounds[round].tables.find((t) => t.number === table);
  }

  commitScore(round: number, table: number, updatedSeats: PlayerSeat[]) {
    this.tournament.update((tou) => {
      const targetTable = tou?.rounds[round].tables.find((t) => t.number === table);
      if (targetTable) {
        targetTable.seats = updatedSeats;
        targetTable.scored = true;
      }
      return tou;
    });
  }
}

function getTournamentDefaultSettings(): TournamentSettings {
  return {
    roundDuration: moment.duration(2, 'hours'),
    startingGameScore: 30000,
    winnerRiichiSticks: true,
    firstPlaceUma: 15,
    secondPlaceUma: 5,
    thirdPlaceUma: -5,
    fourthPlaceUma: -15,
  };
}
