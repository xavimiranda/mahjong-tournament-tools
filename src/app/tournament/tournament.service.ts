import { inject, Injectable, signal } from '@angular/core';
import { Round, SeatingMap, Table, Tournament } from '../models/tournament';
import { EncodingService } from '../services/encoding.service';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  tournament = signal<Tournament | null>(null);

  private encodingService = inject(EncodingService);

  loadTournament(encodedSeating: string) {
    const map = this.encodingService.decodeObject<SeatingMap>(encodedSeating);

    const rounds: Round[] = map.rounds.map((round) => {
      return {
        tables: round.map((t, i): Table => {
          const players = t.map((p) => map.players.find((player) => player.id === p)!);
          return {
            number: i+1,
            players: players.map((p) => {
              return { player: p };
            }),
          };
        }),
      };
    });
    const t: Tournament =  {
      players: map.players,
      rounds,
      settings: getTournamentDefaultSettings()
    }
    this.tournament.set(t)
  }
}
function getTournamentDefaultSettings(): import("../models/tournament").TournamentSettings {
  return {
    roundDuration: moment.duration(2, 'hours'),
    startingGameScore: 30000,
    firstPlaceUma: 15,
    secondPlaceUma: 5,
    thirdPlaceUma: -5,
    fourthPlaceUma: -15
  }
}

