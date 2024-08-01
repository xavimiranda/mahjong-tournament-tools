import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { RoundResults } from 'good-enough-golfer';
import { ToastrService } from '../services/toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncodingService } from '../services/encoding.service';

type NumberedSeatingMap = RoundResults;
type NamedSeatingMap = RoundResults & {
  namedRounds: string[][][];
};

/** Service responsible to generate seating arrangements, and to deliver this information to components */
@Injectable({
  providedIn: 'root',
})
export class SeatingService implements OnDestroy {
  /** Signal with all the player to round seatings and their repetition score */
  seatingMap = signal<RoundResults | null>(null);
  /** Name of the ngx-spinner to use while seats are generating */
  seatGenSpinner = 'seatGenSpinner' as const;
  /** Flag that indicates if the generation worker is running (ie: if the seats are being generating) */
  isGeneratingSeats = signal<boolean>(false);
  /** Map of the loaded names of the players */
  names = signal<Map<number, string>>(new Map());

  private toastr = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private encodingService = inject(EncodingService)

  private worker!: Worker;

  constructor() {
    this.worker = new Worker(new URL('./seating.worker', import.meta.url));
  }

  ngOnDestroy(): void {
    this.worker.terminate();
  }

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

    this.seatingMap.set(null);
    const tableCount = Math.floor(playerCount / 4);

    this.spinner.show(this.seatGenSpinner, { fullScreen: false });
    this.isGeneratingSeats.set(true);

    this.worker.postMessage({
      groups: tableCount,
      numberOfRounds: rounds,
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

  /**
   * Sequentially loads the array of names 
   * @param pNames array of names
   */
  loadPlayerNames(pNames: string[]) {
    pNames.forEach((name, i) => this.names().set(i, name));
  }

  /**
   * Gets a player name by its number 
   * @param pNumber the player number/index
   * @returns the player name
   */
  getPlayerName(pNumber: number) {
    return this.names().has(pNumber) ? this.names().get(pNumber) : `Player ${pNumber + 1}`;
  }

  /** Encodes the seating information and places it in the clipboard */
  extractSeatings() {
    const obj = {
      rounds: this.seatingMap()?.rounds,
      roundScores: this.seatingMap()?.roundScores,
      players: Array.from(this.names().entries()).map(v => { return {id: v[0], name: v[1]}})
    };
    const encoded = this.encodingService.encodeObject(obj)
    navigator.clipboard.writeText(encoded) 
    this.toastr.success('Coppied to the clipboard.')
    
  }
}
