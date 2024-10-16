import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { RoundResults } from 'good-enough-golfer';
import { ToastrService } from '../services/toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncodingService } from '../services/encoding.service';
import { Player, PlayerCSV } from '../models/player';

type GroupType = 'avoid' | 'forbid';

/** Service responsible to generate seating arrangements, and to deliver this information to components */
@Injectable({
  providedIn: 'root',
})
export class SeatingService implements OnDestroy {
  addSubstitutePlayers(leftOutPlayers: number) {
    for (let i = 1; i <= leftOutPlayers; i++) {
      this.players().push({id: this.players().length, name: `Subsitute ${i}`, isSubstitute: false})
      
    }
  }
  /** Signal with all the player to round seatings and their repetition score */
  seatingMap = signal<RoundResults | null>(null);
  /** Name of the ngx-spinner to use while seats are generating */
  seatGenSpinner = 'seatGenSpinner' as const;
  /** Flag that indicates if the generation worker is running (ie: if the seats are being generating) */
  isGeneratingSeats = signal<boolean>(false);
  /** Map of the loaded names of the players */
  // names = signal<Map<number, string>>(new Map());
  /** Map of the players */
  players = signal<Player[]>([]);

  /** Groups of players that should never be matched against each other */
  forbidGroups = signal<Player[][]>([]);
  /** Groups of players that should be avoided mathching against each other */
  avoidGroups = signal<Player[][]>([]);

  private toastr = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private encodingService = inject(EncodingService);

  private worker!: Worker;

  constructor() {
    this.worker = new Worker(new URL('./seating.worker', import.meta.url));
  }

  ngOnDestroy(): void {
    this.worker.terminate();
  }

  //#region Seat Generation
  /**
   * Generates the seatings arranjments.
   * The generation is delegates to a web-worker
   * Players are represented as a number. The map **names** should be used to retrive each player's name
   * @param playerCount total player count
   * @param rounds number of hanchan
   * @returns {RoundResults} object with the rounds as a array of nested arrays, and a array of the repetion count for each round
   */
  generateSeatings(playerCount: number, rounds: number) {
    if (playerCount < 4) {
      this.toastr.error('You need more than 4 players to plan out a tournament');
      return;
    }
    if (playerCount > 200 || rounds > 6)
      this.toastr.warn('Generating seats for big tournaments can take some time. Please be patient!');

    if( playerCount < this.players().length) 
      this.toastr.warn(`Not all players in the loaded list will be included in the tournament. ${this.players().length-playerCount} left out`)

    this.seatingMap.set(null);
    const tableCount = Math.floor(playerCount / 4);

    this.spinner.show(this.seatGenSpinner, { fullScreen: false });
    this.isGeneratingSeats.set(true);

    this.worker.postMessage({
      groups: tableCount,
      numberOfRounds: rounds,
      forbidGroups: this.forbidGroups().map((group) => group.map((p) => p.id)),
      avoidGroups: this.avoidGroups().map((group) => group.map((p) => p.id)),
    });
    // const results = generateRounds();
    this.worker.onmessage = ({ data }) => {
      this.seatingMap.set(data);
      this.spinner.hide(this.seatGenSpinner);
      this.isGeneratingSeats.set(false);
    };
  }

  /** Interrupts the generation, making sure that the web worker is terminated and any spinner is stopped */
  stopSeatGeneration() {
    this.worker.terminate();
    this.isGeneratingSeats.set(false);
    this.spinner.hide(this.seatGenSpinner);
  }
  //#endregion

  /**
   * Sequentially loads the array of names
   * @param pNames array of names
   */
  loadPlayerNames(pNames: string[]) {
    this.players.update((curPlayers) => {
      pNames.forEach((name, i) => curPlayers.push({ id: i, name: name, isSubstitute: false }));
      return curPlayers;
    });
  }

  loadPlayers(data: PlayerCSV[]) {
    const avoidGroups: Player[][] = [];
    const forbidGroups: Player[][] = [];
    const players = data.map((csv, i) => {
      const p: Player = {
        id: i,
        name: csv.name,
        country: csv.country,
        associationId: csv.associationId,
        team: csv.team,
        isSubstitute: false
      };
      csv.avoidGroups
        ?.split(' ')
        .sort()
        .forEach((g) => {
          const groupNumber = parseInt(g) - 1;
          if (!avoidGroups[groupNumber]) avoidGroups[groupNumber] = [];
          avoidGroups[groupNumber].push(p);
        });
      csv.forbidGroups
        ?.split(' ')
        .sort()
        .forEach((g) => {
          const groupNumber = parseInt(g) - 1;
          if (!forbidGroups[groupNumber]) forbidGroups[groupNumber] = [];
          forbidGroups[groupNumber].push(p);
        });
      return p;
    });
    this.avoidGroups.set(avoidGroups);
    this.forbidGroups.set(forbidGroups);
    this.players.set(players);
  }

  /** Returns all loaded player names as an array */
  getPlayerNames(): string[] {
    return [...this.players().map((p) => p.name)];
  }

  /**
   * Gets a player name by its number
   * @param pNumber the player number/index
   * @returns the player name
   */
  getPlayerName(pNumber: number) {
    const player = this.players().find((p) => p.id === pNumber);
    return player ? player.name : `Player ${pNumber + 1}`;
  }

  /** Encodes the seating information and places it in the clipboard */
  saveSeatingsToClipboard(playerCount: number) {
    const encoded = this.getEncodedSeatings(playerCount)
    navigator.clipboard.writeText(encoded);
    this.toastr.success('Seating arrangement successfully copied to your clipboard!')
  }

  getEncodedSeatings(playerCount: number) {
    const obj = {
      rounds: this.seatingMap()?.rounds,
      roundScores: this.seatingMap()?.roundScores,
      players: this.players().slice(0, playerCount),
    };
    return this.encodingService.encodeObject(obj);
  }

  //#region Groups
  addGroup(group: GroupType) {
    const cg = this.chooseGroup(group);
    console.log(cg());
    cg.update((cV) => [...cV, []]);
    return this.chooseGroup(group).length - 1;
  }

  /**
   * Returns either the avoid groups or the forbidden groups depending on the passed string
   * @param {'avoid'| 'forbid'} group group to choose
   * @returns the chosen group
   */
  chooseGroup(group: GroupType) {
    return group === 'avoid' ? this.avoidGroups : this.forbidGroups;
  }

  removePlayerFromGroup(group: GroupType, groupNumber: number, name: string) {
    const player = this.players().find((p) => p.name === name)!;
    this.chooseGroup(group).update((groups) => {
      groups[groupNumber] = groups[groupNumber].filter((p) => p.name !== name);
      return groups;
    });
  }

  addPlayerToGroup(group: GroupType, name: string, groupNumber: number) {
    const player = this.players().find((p) => p.name === name)!;
    if (!this.chooseGroup(group)()[groupNumber].includes(player))
      this.chooseGroup(group).update((groups) => {
        groups[groupNumber].push(player);
        return groups;
      });
  }

  /** Removes a group, either forbid or avoid */
  removeGroup(group: GroupType, groupNumber: number) {
    const g = this.chooseGroup(group);
    g.update((current) => {
      current.splice(groupNumber, 1);
      return current;
    });
  }
  //#endregion
}
