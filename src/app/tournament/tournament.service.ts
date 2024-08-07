import { inject, Injectable, OnInit, signal } from '@angular/core';
import { Round, SeatingMap, Table, Tournament, TournamentSettings } from '../models/tournament';
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

  loadTournament(encodedSeating: string) {
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
            seats: players.map((p) => {
              return { player: p };
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

  loadTournamentFromLocalStorage() {
    const t = localStorage.getItem('MTT-TOURNAMENT');
    if (t) {
      const tournament = this.encodingService.decodeObject<Tournament>(t);
      tournament.settings.roundDuration = moment.duration(tournament.settings.roundDuration)
      this.tournament.set(tournament)
    }
  }

  saveTournamentToLocalStorage() {
    if (this.tournament())
      localStorage.setItem('MTT-TOURNAMENT', this.encodingService.encodeObject(this.tournament()!));
  }

  savedTournamentExists() {
    return localStorage.getItem('MTT-TOURNAMENT') !== null;
  }
}

function getTournamentDefaultSettings(): TournamentSettings {
  return {
    roundDuration: moment.duration(2, 'hours'),
    startingGameScore: 30000,
    firstPlaceUma: 15,
    secondPlaceUma: 5,
    thirdPlaceUma: -5,
    fourthPlaceUma: -15,
  };
}
